const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Create product (admin only)
router.post('/', authMiddleware, adminMiddleware, productController.createProduct);

// Update product (admin only)
router.put('/:id', authMiddleware, adminMiddleware, productController.updateProduct);

// Delete product (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;
