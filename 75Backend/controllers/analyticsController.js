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
    eventType: { type: String, default: 'pageview' }, // 'pageview' | 'whatsapp_click'
    page: { type: String, default: '/' },
    source: { type: String, default: '📱 Direct Traffic' },
    device: { type: String, default: 'Desktop' },
    referrer: { type: String, default: '' },
    revenue: { type: Number, default: 0 },
    converted: { type: Boolean, default: false },
    ip: String,
    userAgent: String
  }, { timestamps: true });

  AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
}

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
    const { eventType = 'pageview', page = '/', source, device, referrer } = req.body;

    await AnalyticsEvent.create({
      eventType,
      page,
      source: source || '📱 Direct Traffic',
      device: device || 'Desktop',
      referrer: referrer || '',
      userAgent: req.headers['user-agent'] || '',
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
                  { $in: ["$status", ["paid", "completed", "Delivered", "Paid", "delivered"]] },
                  { $ifNull: ["$totalAmount", "$totalPrice", 0] },
                  0
                ]
              }
            },
            totalOrders: { $sum: 1 },
            paidOrders: {
              $sum: {
                $cond: [
                  { $in: ["$status", ["paid", "completed", "Delivered", "Paid", "delivered"]] },
                  1, 0
                ]
              }
            },
            pendingOrders: {
              $sum: {
                $cond: [
                  { $in: ["$status", ["pending", "Processing", "Pending", "processing"]] },
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
                  { $in: ["$status", ["paid", "completed", "Delivered", "Paid", "delivered"]] },
                  { $ifNull: ["$totalAmount", "$totalPrice", 0] },
                  0
                ]
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]).catch(() => []),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
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
        status: o.status || 'Pending',
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
// GET /api/analytics/seo-report (SEO & Traffic Analytics)
// ═══════════════════════════════════════════════════════════════════
export const getSEOReport = async (req, res) => {
  try {
    const { days = '30' } = req.query;
    const dateFilter = getDateFilter(days);

    const [
      totalSessions,
      trafficSources,
      topPages,
      whatsappLeads,
      orderStats
    ] = await Promise.all([
      // Total tracked visits
      AnalyticsEvent.countDocuments({ ...dateFilter, eventType: 'pageview' }).catch(() => 0),

      // Traffic breakdown
      AnalyticsEvent.aggregate([
        { $match: { ...dateFilter, eventType: 'pageview' } },
        {
          $group: {
            _id: '$source',
            visits: { $sum: 1 }
          }
        },
        { $sort: { visits: -1 } }
      ]).catch(() => []),

      // Top pages
      AnalyticsEvent.aggregate([
        { $match: { ...dateFilter, eventType: 'pageview' } },
        {
          $group: {
            _id: '$page',
            views: { $sum: 1 }
          }
        },
        { $sort: { views: -1 } },
        { $limit: 8 }
      ]).catch(() => []),

      // WhatsApp Leads
      AnalyticsEvent.aggregate([
        { $match: { ...dateFilter, eventType: 'whatsapp_click' } },
        {
          $group: {
            _id: '$page',
            leadsCount: { $sum: 1 }
          }
        },
        { $sort: { leadsCount: -1 } },
        { $limit: 6 }
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
                  { $in: ["$status", ["paid", "completed", "Delivered", "Paid", "delivered"]] },
                  { $ifNull: ["$totalAmount", "$totalPrice", 0] },
                  0
                ]
              }
            },
            totalConversions: {
              $sum: {
                $cond: [
                  { $in: ["$status", ["paid", "completed", "Delivered", "Paid", "delivered"]] },
                  1, 0
                ]
              }
            }
          }
        }
      ]).catch(() => [])
    ]);

    const totalRevenue = orderStats[0]?.totalRevenue || 0;
    const totalConversions = orderStats[0]?.totalConversions || 0;

    const conversionRate = totalSessions > 0
      ? `${((totalConversions / totalSessions) * 100).toFixed(2)}%`
      : '0.00%';

    // Default channels if brand new database
    const sourcesWithDefaults = trafficSources.length > 0 ? trafficSources.map(s => ({
      ...s,
      conversions: totalConversions,
      revenue: totalRevenue
    })) : [
      { _id: '🔍 Google Search', visits: 0, conversions: 0, revenue: 0 },
      { _id: '🤖 AI Search Engines', visits: 0, conversions: 0, revenue: 0 },
      { _id: '💬 WhatsApp', visits: 0, conversions: 0, revenue: 0 },
      { _id: '📱 Direct Traffic', visits: 0, conversions: 0, revenue: 0 },
      { _id: '🌐 Social Media', visits: 0, conversions: 0, revenue: 0 }
    ];

    return res.status(200).json({
      summary: {
        totalSessions,
        totalRevenue,
        totalConversions,
        conversionRate
      },
      trafficSources: sourcesWithDefaults,
      topPages,
      whatsappLeads
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