const crypto = require('crypto');
const https = require('https');

const generateMoMoPaymentUrl = async (orderId, amount) => {
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const requestId = `${partnerCode}${orderId}`;
  const orderInfo = `Order ${orderId}`;
  const returnUrl = `${process.env.FRONTEND_URL}/payment/momo/return`;
  const backendBaseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  const notifyUrl = `${backendBaseUrl}/api/payments/momo/callback`;
  const requestType = 'captureWallet';

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipAddress=127.0.0.1&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}`;

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = {
    partnerCode,
    partnerName: 'Test Partner',
    storeId: '1',
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl: returnUrl,
    notifyUrl,
    ipAddress: '127.0.0.1',
    requestType,
    autoCapture: true,
    lang: 'vi',
    signature,
  };

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/v2/gateway/api/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
    });

    req.on('error', reject);
    req.write(JSON.stringify(requestBody));
    req.end();
  });
};

module.exports = { generateMoMoPaymentUrl };
