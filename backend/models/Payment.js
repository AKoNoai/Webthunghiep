const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true,
  },
  paymentMethod: {
    type: String,
    enum: ['vnpay', 'momo', 'cod'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled'],
    default: 'pending',
  },
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed,
  },
  redirectUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
