const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, adminMiddleware, orderController.getAllOrders);
router.get('/:id', authMiddleware, adminMiddleware, orderController.getOrderById);
router.patch('/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus);
router.patch('/:id/cancel', authMiddleware, adminMiddleware, orderController.cancelOrder);

module.exports = router;
