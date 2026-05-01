const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { generateVNPayUrl, verifyVNPayHash } = require('../utils/vnpay');
const { generateMoMoPaymentUrl } = require('../utils/momo');

// Create VNPay payment
exports.createVNPayPayment = async (req, res) => {
  try {
    const { orderId, bankCode } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const payment = new Payment({
      order: orderId,
      paymentMethod: 'vnpay',
      amount: order.totalAmount,
      status: 'pending',
    });

    await payment.save();

    const paymentUrl = generateVNPayUrl(payment._id.toString(), order.totalAmount, bankCode);

    res.json({
      message: 'Payment URL generated',
      paymentUrl,
      paymentId: payment._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create MoMo payment
exports.createMoMoPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const payment = new Payment({
      order: orderId,
      paymentMethod: 'momo',
      amount: order.totalAmount,
      status: 'pending',
    });

    await payment.save();

    const momoResponse = await generateMoMoPaymentUrl(payment._id.toString(), order.totalAmount);

    res.json({
      message: 'MoMo payment created',
      ...momoResponse,
      paymentId: payment._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VNPay callback
exports.vnpayCallback = async (req, res) => {
  try {
    const vnpay_Params = req.query;

    if (!verifyVNPayHash(vnpay_Params)) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const paymentId = vnpay_Params.vnp_TxnRef;
    const responseCode = vnpay_Params.vnp_ResponseCode;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (responseCode === '00') {
      payment.status = 'success';
      payment.transactionId = vnpay_Params.vnp_TransactionNo;
      payment.paymentDetails = vnpay_Params;

      const order = await Order.findByIdAndUpdate(
        payment.order,
        { paymentStatus: 'completed' },
        { new: true }
      );

      await payment.save();

      res.json({
        message: 'Payment successful',
        payment,
        order,
      });
    } else {
      payment.status = 'failed';
      await payment.save();

      res.status(400).json({
        message: 'Payment failed',
        responseCode,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MoMo callback
exports.momoCallback = async (req, res) => {
  try {
    const { orderId, resultCode } = req.body;

    const payment = await Payment.findById(orderId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (resultCode === 0) {
      payment.status = 'success';
      payment.paymentDetails = req.body;

      const order = await Order.findByIdAndUpdate(
        payment.order,
        { paymentStatus: 'completed' },
        { new: true }
      );

      await payment.save();

      res.json({
        message: 'Payment successful',
        payment,
        order,
      });
    } else {
      payment.status = 'failed';
      await payment.save();

      res.status(400).json({
        message: 'Payment failed',
        resultCode,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment details
exports.getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create COD payment
exports.createCODPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const payment = new Payment({
      order: orderId,
      paymentMethod: 'cod',
      amount: order.totalAmount,
      status: 'pending',
    });

    await payment.save();

    res.json({
      message: 'COD payment created',
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
