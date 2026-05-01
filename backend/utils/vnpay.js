const crypto = require('crypto');

const generateVNPayUrl = (orderId, amount, bankCode = '') => {
  const vnpay_Url = "https://sandbox.vnpayment.vn/paygate";
  const vnpay_TmnCode = process.env.VNPAY_TMN_CODE;
  const vnpay_HashSecret = process.env.VNPAY_HASH_SECRET;

  const vnpay_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: vnpay_TmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Order ${orderId}`,
    vnp_OrderType: 'other',
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: `${process.env.FRONTEND_URL}/payment/vnpay/return`,
    vnp_IpAddr: '127.0.0.1',
    vnp_CreateDate: new Date().toISOString().replace(/[-:]/g, '').slice(0, 14),
  };

  if (bankCode) {
    vnpay_Params.vnp_BankCode = bankCode;
  }

  const signData = Object.keys(vnpay_Params)
    .sort()
    .map(key => `${key}=${vnpay_Params[key]}`)
    .join('&');

  const hmac = crypto.createHmac('sha512', vnpay_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnpay_Params.vnp_SecureHash = signed;

  return `${vnpay_Url}?${new URLSearchParams(vnpay_Params).toString()}`;
};

const verifyVNPayHash = (vnpay_Params) => {
  const secureHash = vnpay_Params.vnp_SecureHash;
  delete vnpay_Params.vnp_SecureHash;
  delete vnpay_Params.vnp_SecureHashType;

  const signData = Object.keys(vnpay_Params)
    .sort()
    .map(key => `${key}=${vnpay_Params[key]}`)
    .join('&');

  const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  return signed === secureHash;
};

module.exports = { generateVNPayUrl, verifyVNPayHash };
