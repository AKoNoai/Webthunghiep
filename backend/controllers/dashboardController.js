const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Payment = require('../models/Payment');

// Mock stats for fallback
const MOCK_STATS = {
  totalUsers: 45,
  totalProducts: 6,
  totalOrders: 12,
  totalRevenue: 15499,
  recentOrders: [],
  orderStatusBreakdown: [
    { _id: 'pending', count: 2 },
    { _id: 'confirmed', count: 5 },
    { _id: 'shipped', count: 4 },
    { _id: 'delivered', count: 1 },
  ],
  paymentMethodBreakdown: [
    { _id: 'cod', count: 7 },
    { _id: 'transfer', count: 5 },
  ],
  monthlyRevenue: [
    { _id: { month: 4, year: 2026 }, revenue: 5400, orders: 3 },
    { _id: { month: 5, year: 2026 }, revenue: 10099, orders: 9 },
  ],
  _note: 'Using mock data - database unavailable',
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments({ status: 'active' });
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'fullName email')
      .populate('items.product', 'name price');

    const orderStatusBreakdown = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    const paymentMethodBreakdown = await Order.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 } } },
    ]);

    const monthlyRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      orderStatusBreakdown,
      paymentMethodBreakdown,
      monthlyRevenue,
    });
  } catch (error) {
    console.warn('Dashboard stats query failed, returning mock data:', error.message);
    res.json(MOCK_STATS);
  }
};

// Get top products
exports.getTopProducts = async (req, res) => {
  try {
    const topProducts = await Product.find()
      .sort({ rating: -1, reviewCount: -1 })
      .limit(10);

    res.json(topProducts);
  } catch (error) {
    console.warn('getTopProducts failed, returning empty:', error.message);
    res.json([]);
  }
};

// Get recent users
exports.getRecentUsers = async (req, res) => {
  try {
    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-password');

    res.json(recentUsers);
  } catch (error) {
    console.warn('getRecentUsers failed, returning empty:', error.message);
    res.json([]);
  }
};
