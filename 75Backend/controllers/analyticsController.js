// 75Backend/controllers/analyticsController.js
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Blog } from '../models/Blog.js';

export const getAnalytics = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // ─── Previous Period for Comparison ────────────────────────────
    const prevStartDate = new Date();
    prevStartDate.setDate(prevStartDate.getDate() - (days * 2));
    const prevEndDate = new Date();
    prevEndDate.setDate(prevEndDate.getDate() - days);

    // ─── OVERVIEW STATS ───────────────────────────────────────────
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      totalBlogs,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      processingOrders,
      newUsersThisMonth,
      lowStockProducts,
      ordersThisPeriod,
      ordersPrevPeriod,
    ] = await Promise.all([
      Order.countDocuments({}),
      User.countDocuments({}),
      Product.countDocuments({}),
      Blog.countDocuments({ status: 'published' }),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
      Order.countDocuments({ status: 'processing' }),
      User.countDocuments({
        createdAt: { $gte: new Date(new Date().setDate(1)) }
      }),
      Product.countDocuments({ stock: { $lte: 5 } }),
      Order.countDocuments({ createdAt: { $gte: startDate } }),
      Order.countDocuments({
        createdAt: { $gte: prevStartDate, $lte: prevEndDate }
      }),
    ]);

    // ─── TOTAL REVENUE ─────────────────────────────────────────────
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // ─── REVENUE THIS PERIOD ───────────────────────────────────────
    const periodRevenueResult = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: startDate }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const periodRevenue = periodRevenueResult[0]?.total || 0;

    // ─── PREVIOUS PERIOD REVENUE ──────────────────────────────────
    const prevRevenueResult = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: prevStartDate, $lte: prevEndDate }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const prevPeriodRevenue = prevRevenueResult[0]?.total || 0;

    // ─── REVENUE THIS MONTH ────────────────────────────────────────
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthRevenueResult = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: monthStart }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const monthRevenue = monthRevenueResult[0]?.total || 0;

    // ─── TODAY'S STATS ────────────────────────────────────────────
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [todayOrders, todayRevResult, todayUsers] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: todayStart } }),
      Order.aggregate([
        {
          $match: {
            status: { $ne: 'cancelled' },
            createdAt: { $gte: todayStart }
          }
        },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      User.countDocuments({ createdAt: { $gte: todayStart } }),
    ]);
    const todayRevenue = todayRevResult[0]?.total || 0;

    // ─── GROWTH CALCULATIONS ──────────────────────────────────────
    const revenueGrowth = prevPeriodRevenue > 0
      ? (((periodRevenue - prevPeriodRevenue) / prevPeriodRevenue) * 100).toFixed(1)
      : 0;

    const orderGrowth = ordersPrevPeriod > 0
      ? (((ordersThisPeriod - ordersPrevPeriod) / ordersPrevPeriod) * 100).toFixed(1)
      : 0;

    // ─── ORDERS PER DAY (for chart) ────────────────────────────────
    const ordersPerDay = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // ─── REVENUE PER MONTH (for chart) ────────────────────────────
    const revenuePerMonth = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]);

    // ─── TOP SELLING PRODUCTS ──────────────────────────────────────
    const topProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.qty' },
          totalRevenue: {
            $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] }
          },
          name: { $first: '$orderItems.name' },
          image: { $first: '$orderItems.image' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // ─── ORDER STATUS BREAKDOWN ────────────────────────────────────
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // ─── RECENT ORDERS ─────────────────────────────────────────────
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('user', 'name email')
      .lean();

    // ─── TOP CATEGORIES ────────────────────────────────────────────
    const topCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    // ─── LOW STOCK PRODUCTS ────────────────────────────────────────
    const lowStockItems = await Product.find({ stock: { $lte: 5 } })
      .select('name stock category price imageUrl')
      .sort({ stock: 1 })
      .limit(6)
      .lean();

    // ─── NEW USERS PER DAY ─────────────────────────────────────────
    const usersPerDay = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // ─── AVERAGE ORDER VALUE ──────────────────────────────────────
    const avgOrderResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, avg: { $avg: '$totalPrice' } } }
    ]);
    const avgOrderValue = avgOrderResult[0]?.avg || 0;

    console.log('✅ Analytics fetched -', new Date().toLocaleTimeString());

    res.json({
      overview: {
        totalOrders,
        totalUsers,
        totalProducts,
        totalBlogs,
        totalRevenue,
        monthRevenue,
        periodRevenue,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        processingOrders,
        newUsersThisMonth,
        lowStockProducts: lowStockProducts,
        avgOrderValue,
        revenueGrowth,
        orderGrowth,
        todayOrders,
        todayRevenue,
        todayUsers,
      },
      charts: {
        ordersPerDay,
        revenuePerDay: ordersPerDay,
        revenuePerMonth,
        usersPerDay,
      },
      topProducts,
      topCategories,
      ordersByStatus,
      recentOrders,
      lowStockItems,
      lastUpdated: new Date().toISOString(),
    });

  } catch (err) {
    console.error('❌ Analytics error:', err.message);
    res.status(500).json({ message: err.message });
  }
};