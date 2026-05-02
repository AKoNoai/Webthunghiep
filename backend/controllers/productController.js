const Product = require('../models/Product');

// Mock data for fallback when DB is unavailable
const MOCK_PRODUCTS = [
  { _id: '1', name: 'Laptop Pro', description: 'High-performance laptop', price: 1299, discountPrice: 999, category: 'electronics', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop', stock: 10, sku: 'LAPTOP-001', status: 'active' },
  { _id: '2', name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 49, discountPrice: 29, category: 'electronics', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop', stock: 50, sku: 'MOUSE-001', status: 'active' },
  { _id: '3', name: 'USB-C Cable', description: 'Fast charging USB-C cable', price: 19, category: 'electronics', image: 'https://images.unsplash.com/photo-1525966222134-fcebfc4d00b0?w=300&h=300&fit=crop', stock: 100, sku: 'USB-001', status: 'active' },
  { _id: '4', name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', price: 149, discountPrice: 99, category: 'electronics', image: 'https://images.unsplash.com/photo-1587829191301-32ca9fce8f5f?w=300&h=300&fit=crop', stock: 20, sku: 'KB-001', status: 'active' },
  { _id: '5', name: '4K Monitor', description: '27-inch 4K monitor', price: 499, discountPrice: 399, category: 'electronics', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop', stock: 8, sku: 'MON-001', status: 'active' },
  { _id: '6', name: 'Gaming Headset', description: 'Wireless gaming headset', price: 129, discountPrice: 79, category: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop', stock: 30, sku: 'HS-001', status: 'active' }
];

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, page = 1, limit = 10, search } = req.query;
    let filter = { status: 'active' };

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.warn('DB query failed, returning mock data:', error.message);
    // Return mock data as fallback
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const start = (page - 1) * limit;
    const paginatedMock = MOCK_PRODUCTS.slice(start, start + limit);
    
    res.json({
      products: paginatedMock,
      totalPages: Math.ceil(MOCK_PRODUCTS.length / limit),
      currentPage: page,
      total: MOCK_PRODUCTS.length,
      _note: 'Using mock data - database unavailable'
    });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const mockProduct = MOCK_PRODUCTS.find(p => p._id === req.params.id);
      if (mockProduct) return res.json(mockProduct);
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    const mockProduct = MOCK_PRODUCTS.find(p => p._id === req.params.id);
    if (mockProduct) return res.json(mockProduct);
    res.status(500).json({ message: error.message });
  }
};

// Create product (admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, image, images, stock, sku } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      category,
      image,
      images,
      stock,
      sku,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'deleted', updatedAt: Date.now() },
      { new: true }
    );
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
