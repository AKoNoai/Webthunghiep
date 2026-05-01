const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);

// Get user by ID
router.get('/:id', authMiddleware, userController.getUserById);

// Update user
router.put('/:id', authMiddleware, userController.updateUser);

// Delete user (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

// Change user status (admin only)
router.patch('/:id/status', authMiddleware, adminMiddleware, userController.changeUserStatus);

module.exports = router;
