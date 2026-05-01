const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const User = require('./models/User');

const dns = require('dns');
// Force reliable public DNS resolvers for Atlas SRV lookups.
dns.setServers(['8.8.8.8', '1.1.1.1']);


// Load environment variables
dotenv.config();

const app = express();

const ensureDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
    }

    if (existingAdmin.fullName !== 'Admin') {
      existingAdmin.fullName = 'Admin';
    }

    existingAdmin.phone = existingAdmin.phone || '0000000000';
    existingAdmin.password = adminPassword;
    await existingAdmin.save();
    console.log(`Default admin updated: ${adminEmail}`);
    return;
  }

  await User.create({
    fullName: 'Admin',
    email: adminEmail,
    phone: '0000000000',
    password: adminPassword,
    role: 'admin',
    status: 'active',
  });

  console.log(`Default admin created: ${adminEmail}`);
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const DEFAULT_PORT = Number(process.env.PORT) || 5000;

const startServer = (port, retriesLeft = 5) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && retriesLeft > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy, retrying on ${nextPort}...`);
      startServer(nextPort, retriesLeft - 1);
      return;
    }

    throw error;
  });
};

const bootstrap = async () => {
  await connectDB();
  await ensureDefaultAdmin();
  startServer(DEFAULT_PORT);
};

bootstrap().catch((error) => {
  console.error('Failed to bootstrap server:', error.message);
  process.exit(1);
});

module.exports = app;
