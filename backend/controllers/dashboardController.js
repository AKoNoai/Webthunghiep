const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Payment = require('../models/Payment');

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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};
