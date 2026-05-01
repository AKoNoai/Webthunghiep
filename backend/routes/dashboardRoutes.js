const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/stats', authMiddleware, adminMiddleware, dashboardController.getDashboardStats);
router.get('/top-products', dashboardController.getTopProducts);
router.get('/recent-users', authMiddleware, adminMiddleware, dashboardController.getRecentUsers);

module.exports = router;
