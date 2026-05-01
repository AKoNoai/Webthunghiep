const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/vnpay/create', authMiddleware, paymentController.createVNPayPayment);
router.post('/momo/create', authMiddleware, paymentController.createMoMoPayment);
router.post('/cod/create', authMiddleware, paymentController.createCODPayment);
router.get('/vnpay/callback', paymentController.vnpayCallback);
router.post('/momo/callback', paymentController.momoCallback);
router.get('/:id', authMiddleware, adminMiddleware, paymentController.getPaymentDetails);

module.exports = router;
