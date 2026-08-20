// 75Backend/controllers/analyticsController.js
import mongoose from 'mongoose';

// ── Model Imports (Configured to support both default/named exports safely) ──
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

// Helper: Calculate date range filter
const getDateFilter = (timeRange) => {
  const now = new Date();
  let start = new Date();

  switch (timeRange) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'yesterday':
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      break;
    case '7days':
      start.setDate(start.getDate() - 7);
      break;
    case '30days':
      start.setDate(start.getDate() - 30);
      break;
    case 'all':
    default:
      return {}; // All-time (no filter)
  }

  return { createdAt: { $gte: start, $lte: now } };
};

// ── GET /api/analytics/dashboard ──
export const getDashboardStats = async (req, res) => {
  try {
    const { timeRange = 'today' } = req.query;
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
      recentSwaps
    ] = await Promise.all([
      // 1. Order and Revenue Aggregation (using standard paid states)
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
                  1,
                  0
                ]
              }
            },
            pendingOrders: {
              $sum: {
                $cond: [
                  { $in: ["$status", ["pending", "Processing", "Pending", "processing"]] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]).catch(() => []),

      // 2. User statistics
      User.countDocuments().catch(() => 0),
      User.countDocuments(dateFilter).catch(() => 0),

      // 3. Products in inventory
      Product.countDocuments().catch(() => 0),

      // 4. Service booking statistics
      RepairBooking.countDocuments(dateFilter).catch(() => 0),
      SwapDeal.countDocuments(dateFilter).catch(() => 0),
      EngineerRequest.countDocuments(dateFilter).catch(() => 0),
      DigitalProject.countDocuments(dateFilter).catch(() => 0),

      // 5. Recent activity logs
      Order.find().sort({ createdAt: -1 }).limit(4).lean().catch(() => []),
      RepairBooking.find().sort({ createdAt: -1 }).limit(4).lean().catch(() => []),
      SwapDeal.find().sort({ createdAt: -1 }).limit(3).lean().catch(() => [])
    ]);

    const orders = orderMetrics[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      paidOrders: 0,
      pendingOrders: 0
    };

    const avgOrderValue = orders.paidOrders > 0
      ? Math.round(orders.totalRevenue / orders.paidOrders)
      : 0;

    // Build timeline of consolidated active operations
    const activities = [
      ...recentOrders.map(o => ({
        id: o._id,
        type: 'order',
        text: `Order #${o._id ? o._id.toString().slice(-6).toUpperCase() : 'NEW'}`,
        amount: (o.totalAmount || o.totalPrice)
          ? `₦${Number(o.totalAmount || o.totalPrice).toLocaleString()}`
          : '₦0',
        status: o.status || 'Pending',
        createdAt: o.createdAt || new Date()
      })),

      ...recentRepairs.map(r => ({
        id: r._id,
        type: 'repair',
        text: `${r.repairId || 'Repair'}: ${r.deviceBrand} ${r.deviceModel || r.deviceType} (${r.issueCategory})`,
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
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    const categories = [
      { name: "Orders & Products", count: orders.totalOrders, color: "bg-blue-600" },
      { name: "Device Repairs", count: repairsCount, color: "bg-emerald-600" },
      { name: "Swap Deals", count: swapsCount, color: "bg-purple-600" },
      { name: "Engineer Requests", count: engineerRequestsCount, color: "bg-amber-500" },
      { name: "Digital Projects", count: digitalProjectsCount, color: "bg-indigo-500" }
    ];

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
          digitalServicesCount: digitalProjectsCount
        },
        categories,
        activities
      }
    });
  } catch (error) {
    console.error('Analytics controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics',
      error: error.message
    });
  }
};

// ── GET /api/analytics/vip-members ──
export const getVIPMembers = async (req, res) => {
  try {
    // Find all users with active/inactive subscription packages defined
    const vipUsers = await User.find({
      membershipTier: { $exists: true, $ne: null, $ne: 'none', $ne: '' }
    })
    .select('name email phone membershipTier membershipExpiry createdAt')
    .sort({ membershipExpiry: -1 });

    return res.status(200).json({
      success: true,
      data: vipUsers
    });
  } catch (error) {
    console.error('VIP members fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve VIP members',
      error: error.message
    });
  }
};

// ── PUT /api/analytics/vip-members/:userId ──
export const updateVIPMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const { membershipTier, membershipExpiry } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        membershipTier: membershipTier || null, 
        membershipExpiry: membershipExpiry || null 
      },
      { new: true }
    ).select('name email phone membershipTier membershipExpiry');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User account not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Membership updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update VIP member error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to apply membership changes',
      error: error.message
    });
  }
};