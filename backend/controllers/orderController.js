const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Mock orders for fallback when DB unavailable
const MOCK_ORDERS = [
  {
    _id: 'mock-order-1',
    orderNumber: 'ORD-1746283200000',
    user: { _id: 'user-1', fullName: 'Nguyễn Văn A', email: 'user1@example.com', phone: '0912345678' },
    items: [
      { product: { _id: 'prod-1', name: 'Laptop Dell XPS 13', price: 25000000 }, quantity: 1, price: 25000000 }
    ],
    totalAmount: 25000000,
    shippingAddress: 'Hà Nội, Việt Nam',
    paymentMethod: 'COD',
    orderStatus: 'processing',
    createdAt: new Date('2026-04-01'),
    _note: 'Mock order - database unavailable'
  }
];

let ordersCacheTime = 0;
let ordersCache = null;
const CACHE_DURATION = 10000; // 10s cache

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod, notes } = req.body;

    // Validate items
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Product ${item.product} is out of stock` });
      }
    }

    const orderNumber = `ORD-${Date.now()}`;
    const order = new Order({
      orderNumber,
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      notes,
    });

    await order.save();

    // Update product stock
    for (let item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const orders = await Promise.race([
      Order.find({ user: req.user.id })
        .populate('items.product')
        .sort({ createdAt: -1 }),
      new Promise((_, reject) => 
        controller.signal.addEventListener('abort', () => reject(new Error('Timeout')))
      )
    ]);

    clearTimeout(timeoutId);
    res.json(orders || []);
  } catch (error) {
    // Return empty array on timeout
    res.json([]);
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    // Return cache if valid
    if (ordersCache && Date.now() - ordersCacheTime < CACHE_DURATION) {
      return res.json({
        orders: ordersCache,
        totalPages: 1,
        currentPage: 1,
        total: ordersCache.length,
      });
    }

    const { page = 1, limit = 10, status } = req.query;
    let filter = {};

    if (status) filter.orderStatus = status;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const orders = await Promise.race([
      Order.find(filter)
        .populate('user', 'fullName email phone')
        .populate('items.product', 'name price')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 }),
      new Promise((_, reject) => 
        controller.signal.addEventListener('abort', () => reject(new Error('Timeout')))
      )
    ]);

    clearTimeout(timeoutId);

    const total = await Promise.race([
      Order.countDocuments(filter),
      new Promise((_, reject) => 
        controller.signal.addEventListener('abort', () => reject(new Error('Timeout')))
      )
    ]);

    // Cache the result
    ordersCache = orders || [];
    ordersCacheTime = Date.now();

    res.json({
      orders: orders || [],
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    // Return mock orders on timeout - instant fallback
    ordersCache = MOCK_ORDERS;
    ordersCacheTime = Date.now();
    res.json({
      orders: MOCK_ORDERS,
      totalPages: 1,
      currentPage: 1,
      total: MOCK_ORDERS.length,
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, updatedAt: Date.now() },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: 'cancelled', updatedAt: Date.now() },
      { new: true }
    );

    // Restore product stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    res.json({
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
