const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Stats endpoint - optional auth (return mock if not authenticated)
router.get('/stats', dashboardController.getDashboardStats);
router.get('/top-products', dashboardController.getTopProducts);
router.get('/recent-users', dashboardController.getRecentUsers);

module.exports = router;
