import express from 'express';
import { Product } from '../models/Product.js';
import { Blog } from '../models/Blog.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // ─── PRODUCTS ────────────────────────────────────────────────
    const totalProducts = await Product.countDocuments();

    const thisMonthProducts = await Product.countDocuments({
      createdAt: { $gte: startOfThisMonth },
    });

    const lastMonthProducts = await Product.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    const productsChange =
      lastMonthProducts === 0
        ? 100
        : parseFloat(
            (((thisMonthProducts - lastMonthProducts) / lastMonthProducts) * 100).toFixed(1)
          );

    // ─── PRODUCT CATEGORIES BREAKDOWN ────────────────────────────
    const categoryBreakdown = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // ─── FEATURED / TOP PICKS etc ─────────────────────────────────
    const featuredCount = await Product.countDocuments({ isFeatured: true });
    const topPicksCount = await Product.countDocuments({ isTopPick: true });
    const bestSellingCount = await Product.countDocuments({ isBestSelling: true });
    const newArrivalsCount = await Product.countDocuments({ isNewArrival: true });
    const dealOfDayCount = await Product.countDocuments({ isDealOfDay: true });

    // ─── LOW STOCK PRODUCTS ───────────────────────────────────────
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .select('name stock price category brand imageUrl')
      .sort({ stock: 1 })
      .limit(5)
      .lean();

    // ─── OUT OF STOCK ─────────────────────────────────────────────
    const outOfStockCount = await Product.countDocuments({ stock: 0 });

    // ─── TOTAL INVENTORY VALUE ────────────────────────────────────
    const inventoryValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
        },
      },
    ]);

    // ─── TOP SELLING PRODUCTS (by sold field) ─────────────────────
    const topSellingProducts = await Product.find({ sold: { $gt: 0 } })
      .select('name sold price category brand imageUrl')
      .sort({ sold: -1 })
      .limit(5)
      .lean();

    // ─── PRODUCTS WITH DISCOUNTS ──────────────────────────────────
    const discountedProducts = await Product.countDocuments({
      discount: { $gt: 0 },
    });

    // ─── RECENT PRODUCTS ──────────────────────────────────────────
    const recentProducts = await Product.find()
      .select('name price category brand stock imageUrl createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // ─── PRODUCTS CHART (last 6 months) ───────────────────────────
    const productsChart = await Product.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const productChartData = productsChart.map((item) => ({
      month: months[item._id.month - 1],
      products: item.count,
    }));

    // ─── BLOGS ───────────────────────────────────────────────────
    const totalBlogs = await Blog.countDocuments();

    const publishedBlogs = await Blog.countDocuments({ status: 'published' });

    const draftBlogs = await Blog.countDocuments({ status: 'draft' });

    const featuredBlogs = await Blog.countDocuments({ isFeatured: true });

    const thisMonthBlogs = await Blog.countDocuments({
      createdAt: { $gte: startOfThisMonth },
    });

    const lastMonthBlogs = await Blog.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    const blogsChange =
      lastMonthBlogs === 0
        ? 100
        : parseFloat(
            (((thisMonthBlogs - lastMonthBlogs) / lastMonthBlogs) * 100).toFixed(1)
          );

    // ─── TOTAL BLOG VIEWS ─────────────────────────────────────────
    const totalBlogViews = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);

    // ─── BLOG CATEGORY BREAKDOWN ──────────────────────────────────
    const blogCategoryBreakdown = await Blog.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // ─── MOST VIEWED BLOGS ────────────────────────────────────────
    const mostViewedBlogs = await Blog.find({ status: 'published' })
      .select('title views category createdAt readTime')
      .sort({ views: -1 })
      .limit(5)
      .lean();

    // ─── RECENT BLOGS ─────────────────────────────────────────────
    const recentBlogs = await Blog.find()
      .select('title status category views createdAt author')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // ─── BLOGS CHART (last 6 months) ──────────────────────────────
    const blogsChart = await Blog.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
          views: { $sum: '$views' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const blogChartData = blogsChart.map((item) => ({
      month: months[item._id.month - 1],
      blogs: item.count,
      views: item.views,
    }));

    // ─── SEND RESPONSE ────────────────────────────────────────────
    return res.json({
      success: true,
      data: {
        products: {
          total: totalProducts,
          change: productsChange,
          thisMonth: thisMonthProducts,
          featured: featuredCount,
          topPicks: topPicksCount,
          bestSelling: bestSellingCount,
          newArrivals: newArrivalsCount,
          dealOfDay: dealOfDayCount,
          outOfStock: outOfStockCount,
          discounted: discountedProducts,
          lowStock: lowStockProducts,
          topSelling: topSellingProducts,
          recentProducts: recentProducts,
          inventoryValue: inventoryValue[0]?.totalValue || 0,
          categoryBreakdown,
          chartData: productChartData,
        },
        blogs: {
          total: totalBlogs,
          change: blogsChange,
          thisMonth: thisMonthBlogs,
          published: publishedBlogs,
          drafts: draftBlogs,
          featured: featuredBlogs,
          totalViews: totalBlogViews[0]?.totalViews || 0,
          categoryBreakdown: blogCategoryBreakdown,
          mostViewed: mostViewedBlogs,
          recentBlogs,
          chartData: blogChartData,
        },
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;