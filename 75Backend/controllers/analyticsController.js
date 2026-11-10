// 75Backend/controllers/analyticsController.js
import mongoose from 'mongoose';

// ── Model Imports ──
import { RepairBooking } from '../models/RepairBooking.js';
import * as OrderMod from '../models/Order.js';
import * as UserMod from '../models/User.js';
import * as ProductMod from '../models/Product.js';
import * as SwapDealMod from '../models/SwapDeal.js';
import * as EngineerRequestMod from '../models/EngineerRequest.js';
import * as DigitalProjectMod from '../models/DigitalProject.js';

const Order = OrderMod.default || OrderMod.Order || mongoose.model('Order');
const User = UserMod.default || UserMod.User || mongoose.model('User');
const Product = ProductMod.default || ProductMod.Product || mongoose.model('Product');
const SwapDeal = SwapDealMod.default || SwapDealMod.SwapDeal || mongoose.model('SwapDeal');
const EngineerRequest = EngineerRequestMod.default || EngineerRequestMod.EngineerRequest || mongoose.model('EngineerRequest');
const DigitalProject = DigitalProjectMod.default || DigitalProjectMod.DigitalProject || mongoose.model('DigitalProject');

// ── AnalyticsEvent Model Definition ──
let AnalyticsEvent;
try {
  AnalyticsEvent = mongoose.model('AnalyticsEvent');
} catch {
  const analyticsEventSchema = new mongoose.Schema({
    // 'pageview' | 'whatsapp_click' | 'call_click' | 'email_click' | 'lead'
    eventType: { type: String, default: 'pageview', index: true },
    page: { type: String, default: '/' },
    landingPage: { type: String, default: '' },
    source: { type: String, default: '📱 Direct Traffic' },
    trafficSource: { type: String, default: '' }, // visitor's real channel (used for lead attribution)
    device: { type: String, default: 'Desktop' },
    referrer: { type: String, default: '' },
    leadType: { type: String, default: '' }, // only for eventType 'lead' (repair_request, contact_form, ...)
    visitorId: { type: String, default: '', index: true }, // anonymous random id from the browser
    sessionId: { type: String, default: '', index: true },
    human: { type: Boolean, default: false, index: true }, // true only when a real user interaction was confirmed
    revenue: { type: Number, default: 0 },
    converted: { type: Boolean, default: false },
    ip: String,
    userAgent: String
  }, { timestamps: true });

  analyticsEventSchema.index({ eventType: 1, human: 1, createdAt: -1 });

  AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
}

// If another file registered "AnalyticsEvent" first with the OLD schema, the new
// fields would be silently dropped. This warns you at startup if that happens.
if (!AnalyticsEvent.schema.path('human')) {
  console.warn(
    '⚠️  AnalyticsEvent model is missing the new fields (human, visitorId, sessionId...). ' +
    'Another file registers this model with the old schema — update it, or remove it so this controller defines it.'
  );
}

// ── Bot filtering + validation helpers ──
const BOT_UA =
  /bot|crawl|spider|slurp|headless|phantom|puppeteer|playwright|selenium|lighthouse|pagespeed|gtmetrix|pingdom|uptime|facebookexternalhit|telegrambot|curl|wget|python-requests|axios|node-fetch|go-http|okhttp\/|java\//i;

const ALLOWED_EVENTS = ['pageview', 'whatsapp_click', 'call_click', 'email_click', 'lead'];
const LEAD_EVENTS = ['whatsapp_click', 'call_click', 'email_click', 'lead'];

// Your Order model has paymentStatus + orderStatus (there is no "status" field).
// An order counts as a sale when it is paid (or delivered, for cash on delivery)
// and is not cancelled or refunded.
const PAID_EXPR = {
  $and: [
    { $ne: ['$isCancelled', true] },
    { $ne: ['$paymentStatus', 'refunded'] },
    { $ne: ['$orderStatus', 'cancelled'] },
    { $or: [{ $eq: ['$paymentStatus', 'paid'] }, { $eq: ['$orderStatus', 'delivered'] }] }
  ]
};
// Orders still open (not shipped yet)
const OPEN_EXPR = { $in: ['$orderStatus', ['pending', 'confirmed', 'processing']] };

const clip = (value, max, fallback = '') => (typeof value === 'string' ? value.slice(0, max) : fallback);

// Tiny in-memory rate limiter: max 60 events per minute per visitor (or IP)
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60 * 1000;
const hits = new Map();

const isRateLimited = (key) => {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    hits.set(key, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
};

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of hits) {
    if (now - entry.start > RATE_WINDOW_MS) hits.delete(key);
  }
}, RATE_WINDOW_MS).unref();

// Date Filter Helper
const getDateFilter = (timeRange) => {
  const now = new Date();
  let start = new Date();

  switch (timeRange) {
    case 'today':
    case '1':
      start.setHours(0, 0, 0, 0);
      break;
    case 'yesterday':
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      break;
    case '7days':
    case '7':
      start.setDate(start.getDate() - 7);
      break;
    case '30days':
    case '30':
      start.setDate(start.getDate() - 30);
      break;
    case '90days':
    case '90':
      start.setDate(start.getDate() - 90);
      break;
    case 'all':
    case '365':
    default:
      return {};
  }

  return { createdAt: { $gte: start, $lte: now } };
};

// ═══════════════════════════════════════════════════════════════════
// POST /api/analytics/track (Public Tracking Endpoint)
// ═══════════════════════════════════════════════════════════════════
export const trackEvent = async (req, res) => {
  try {
    const body = req.body || {};
    const ua = req.headers['user-agent'] || '';
    const eventType = ALLOWED_EVENTS.includes(body.eventType) ? body.eventType : null;
    const page = clip(body.page, 200, '/') || '/';

    // Silently ignore junk: unknown events, admin pages, empty or bot user-agents.
    // Always answer 200 so bots learn nothing and the frontend never throws.
    if (!eventType || page.startsWith('/admin') || !ua || BOT_UA.test(ua)) {
      return res.status(200).json({ success: true });
    }

    const visitorId = clip(body.visitorId, 64);
    const sessionId = clip(body.sessionId, 64);

    if (isRateLimited(visitorId || req.ip || 'unknown')) {
      return res.status(200).json({ success: true });
    }

    await AnalyticsEvent.create({
      eventType,
      page,
      landingPage: clip(body.landingPage, 200),
      source: clip(body.source, 120) || '📱 Direct Traffic',
      trafficSource: clip(body.trafficSource, 120),
      device: ['Mobile', 'Tablet', 'Desktop'].includes(body.device) ? body.device : 'Desktop',
      referrer: clip(body.referrer, 300),
      leadType: eventType === 'lead' ? clip(body.leadType, 60) : '',
      visitorId,
      sessionId,
      // true only when the new tracker confirmed a real user interaction.
      // Events from the old tracker (no flag) are stored as human: false.
      human: body.human === true && Boolean(visitorId) && Boolean(sessionId),
      userAgent: ua.slice(0, 300),
      ip: req.ip || ''
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(200).json({ success: false }); // Always 200 so frontend never throws
  }
};

// ═══════════════════════════════════════════════════════════════════
// GET /api/analytics/dashboard (Operations Analytics)
// ═══════════════════════════════════════════════════════════════════
export const getDashboardStats = async (req, res) => {
  try {
    const { timeRange = '30days' } = req.query;
    const dateFilter = getDateFilter(timeRange);

    const [
      orderMetrics,
      totalUsers,
      newUsers,
      totalProducts,
      repairsCount,
      swapsCount,
      engineerRequestsCount,
      digitalProjectsCount,
      recentOrders,
      recentRepairs,
      recentSwaps,
      lowStockItems,
      ordersPerDay,
      ordersByStatus
    ] = await Promise.all([
      Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $cond: [
                  PAID_EXPR,
                  { $ifNull: ['$totalAmount', 0] },
                  0
                ]
              }
            },
            totalOrders: { $sum: 1 },
            paidOrders: {
              $sum: {
                $cond: [
                  PAID_EXPR,
                  1, 0
                ]
              }
            },
            pendingOrders: {
              $sum: {
                $cond: [
                  OPEN_EXPR,
                  1, 0
                ]
              }
            }
          }
        }
      ]).catch(() => []),
      User.countDocuments().catch(() => 0),
      User.countDocuments(dateFilter).catch(() => 0),
      Product.countDocuments().catch(() => 0),
      RepairBooking.countDocuments(dateFilter).catch(() => 0),
      SwapDeal.countDocuments(dateFilter).catch(() => 0),
      EngineerRequest.countDocuments(dateFilter).catch(() => 0),
      DigitalProject.countDocuments(dateFilter).catch(() => 0),
      Order.find().sort({ createdAt: -1 }).limit(4).lean().catch(() => []),
      RepairBooking.find().sort({ createdAt: -1 }).limit(4).lean().catch(() => []),
      SwapDeal.find().sort({ createdAt: -1 }).limit(3).lean().catch(() => []),
      Product.find({ stock: { $lte: 5 } }).select('name stock category price').sort({ stock: 1 }).limit(5).lean().catch(() => []),
      Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            orders: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [
                  PAID_EXPR,
                  { $ifNull: ['$totalAmount', 0] },
                  0
                ]
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]).catch(() => []),
      Order.aggregate([
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
      ]).catch(() => [])
    ]);

    const orders = orderMetrics[0] || { totalRevenue: 0, totalOrders: 0, paidOrders: 0, pendingOrders: 0 };
    const avgOrderValue = orders.paidOrders > 0 ? Math.round(orders.totalRevenue / orders.paidOrders) : 0;

    const activities = [
      ...recentOrders.map(o => ({
        id: o._id,
        type: 'order',
        text: `Order #${o._id ? o._id.toString().slice(-6).toUpperCase() : 'NEW'}`,
        amount: (o.totalAmount || o.totalPrice)
          ? `₦${Number(o.totalAmount || o.totalPrice).toLocaleString()}` : '₦0',
        status: o.orderStatus || 'pending',
        createdAt: o.createdAt || new Date()
      })),
      ...recentRepairs.map(r => ({
        id: r._id,
        type: 'repair',
        text: `${r.repairId || 'Repair'}: ${r.deviceBrand} ${r.deviceModel || r.deviceType}`,
        amount: r.estimatedCost
          ? (String(r.estimatedCost).startsWith('₦') ? r.estimatedCost : `₦${Number(r.estimatedCost).toLocaleString()}`)
          : 'Under Diagnostic',
        status: r.status || 'Booked',
        createdAt: r.createdAt || new Date()
      })),
      ...recentSwaps.map(s => ({
        id: s._id,
        type: 'swap',
        text: `Swap: ${s.currentDevice || 'Device'} → ${s.desiredDevice || 'Upgrade'}`,
        amount: 'Trade-in',
        status: s.status || 'Pending',
        createdAt: s.createdAt || new Date()
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          revenue: orders.totalRevenue,
          totalOrders: orders.totalOrders,
          paidOrders: orders.paidOrders,
          pendingOrders: orders.pendingOrders,
          avgOrderValue,
          totalUsers,
          newUsers,
          totalProducts,
          repairsCount,
          swapsCount,
          engineerRequestsCount,
          digitalServicesCount: digitalProjectsCount,
          lowStockProducts: lowStockItems.length
        },
        activities,
        lowStockItems,
        ordersByStatus,
        charts: { ordersPerDay },
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ═══════════════════════════════════════════════════════════════════
// GET /api/analytics/seo-report (SEO & Traffic Analytics — HUMAN ONLY)
// ═══════════════════════════════════════════════════════════════════
export const getSEOReport = async (req, res) => {
  try {
    const { days = '30' } = req.query;
    const dateFilter = getDateFilter(days);

    // Every traffic number below counts only confirmed-human events.
    const humanPageviews = { ...dateFilter, human: true, eventType: 'pageview' };

    const countDistinct = (field, match) =>
      AnalyticsEvent.aggregate([
        { $match: match },
        { $group: { _id: `$${field}` } },
        { $count: 'n' }
      ]).then((r) => r[0]?.n || 0).catch(() => 0);

    const [
      totalHumanPageviews,
      allPageviews,
      humanSessions,
      uniqueVisitors,
      trafficSources,
      topPages,
      whatsappLeads,
      leadSummary,
      leadsBySource,
      orderStats,
      ordersBySource
    ] = await Promise.all([
      // Human pageviews
      AnalyticsEvent.countDocuments(humanPageviews).catch(() => 0),

      // Everything ever recorded as a pageview (bots + old tracker included), for comparison
      AnalyticsEvent.countDocuments({ ...dateFilter, eventType: 'pageview' }).catch(() => 0),

      // Real sessions and unique visitors
      countDistinct('sessionId', humanPageviews),
      countDistinct('visitorId', humanPageviews),

      // Traffic breakdown (visits = human pageviews)
      AnalyticsEvent.aggregate([
        { $match: humanPageviews },
        { $group: { _id: '$source', visits: { $sum: 1 } } },
        { $sort: { visits: -1 } }
      ]).catch(() => []),

      // Top pages
      AnalyticsEvent.aggregate([
        { $match: humanPageviews },
        { $group: { _id: '$page', views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 8 }
      ]).catch(() => []),

      // WhatsApp leads by page (unchanged shape)
      AnalyticsEvent.aggregate([
        { $match: { ...dateFilter, human: true, eventType: 'whatsapp_click' } },
        { $group: { _id: '$page', leadsCount: { $sum: 1 } } },
        { $sort: { leadsCount: -1 } },
        { $limit: 6 }
      ]).catch(() => []),

      // All leads by type: whatsapp_click / call_click / email_click / lead
      AnalyticsEvent.aggregate([
        { $match: { ...dateFilter, human: true, eventType: { $in: LEAD_EVENTS } } },
        { $group: { _id: '$eventType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).catch(() => []),

      // Which traffic channel produced the leads
      AnalyticsEvent.aggregate([
        { $match: { ...dateFilter, human: true, eventType: { $in: LEAD_EVENTS } } },
        {
          $group: {
            _id: { $cond: [{ $ne: ['$trafficSource', ''] }, '$trafficSource', '$source'] },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 8 }
      ]).catch(() => []),

      // Real Revenue & Conversions from Order Model
      Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $cond: [
                  PAID_EXPR,
                  { $ifNull: ['$totalAmount', 0] },
                  0
                ]
              }
            },
            totalConversions: {
              $sum: { $cond: [PAID_EXPR, 1, 0] }
            }
          }
        }
      ]).catch(() => []),

      // Orders that carry a trafficSource (see note in the reply: orders must save it)
      Order.aggregate([
        {
          $match: {
            ...dateFilter,
            $expr: PAID_EXPR,
            trafficSource: { $exists: true, $ne: '' }
          }
        },
        {
          $group: {
            _id: '$trafficSource',
            conversions: { $sum: 1 },
            revenue: { $sum: { $ifNull: ['$totalAmount', 0] } }
          }
        }
      ]).catch(() => [])
    ]);

    const totalRevenue = orderStats[0]?.totalRevenue || 0;
    const totalConversions = orderStats[0]?.totalConversions || 0;

    // Visit-to-order uses real sessions when available
    const denominator = humanSessions || totalHumanPageviews;
    const conversionRate = denominator > 0
      ? `${((totalConversions / denominator) * 100).toFixed(2)}%`
      : '0.00%';

    // Per-channel conversions/revenue only come from orders that recorded their channel.
    // (Before, every channel showed the full store total, which was misleading.)
    const orderSourceMap = new Map(ordersBySource.map((o) => [o._id, o]));

    const sourcesWithDefaults = trafficSources.length > 0
      ? trafficSources.map((s) => ({
          ...s,
          conversions: orderSourceMap.get(s._id)?.conversions || 0,
          revenue: orderSourceMap.get(s._id)?.revenue || 0
        }))
      : [
          { _id: '🔍 Google Search', visits: 0, conversions: 0, revenue: 0 },
          { _id: '🤖 AI Search Engines', visits: 0, conversions: 0, revenue: 0 },
          { _id: '💬 WhatsApp', visits: 0, conversions: 0, revenue: 0 },
          { _id: '📱 Direct Traffic', visits: 0, conversions: 0, revenue: 0 },
          { _id: '🌐 Social Media', visits: 0, conversions: 0, revenue: 0 }
        ];

    return res.status(200).json({
      summary: {
        // Kept under the old name so the current dashboard page keeps working:
        // this is now HUMAN pageviews only.
        totalSessions: totalHumanPageviews,
        totalRevenue,
        totalConversions,
        conversionRate,

        // New numbers for a human-vs-total comparison
        humanPageviews: totalHumanPageviews,
        humanSessions,
        uniqueVisitors,
        allPageviews,
        nonHumanOrLegacyPageviews: Math.max(allPageviews - totalHumanPageviews, 0)
      },
      trafficSources: sourcesWithDefaults,
      topPages,
      whatsappLeads,
      leadSummary,
      leadsBySource
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ═══════════════════════════════════════════════════════════════════
// VIP MEMBERS
// ═══════════════════════════════════════════════════════════════════
export const getVIPMembers = async (req, res) => {
  try {
    const vipUsers = await User.find({
      membershipTier: { $exists: true, $ne: null, $ne: 'none', $ne: '' }
    })
    .select('name email phone membershipTier membershipExpiry createdAt')
    .sort({ membershipExpiry: -1 });

    return res.status(200).json({ success: true, data: vipUsers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVIPMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const { membershipTier, membershipExpiry } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { membershipTier: membershipTier || null, membershipExpiry: membershipExpiry || null },
      { new: true }
    ).select('name email phone membershipTier membershipExpiry');

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};