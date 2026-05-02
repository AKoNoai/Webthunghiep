const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const User = require('./models/User');

const dns = require('dns');
// Force reliable public DNS resolvers for Atlas SRV lookups.
dns.setServers(['8.8.8.8', '1.1.1.1']);


// Load environment variables
dotenv.config();

const app = express();

let dbInitialized = false;
let dbInitError = null;

const ensureDefaultAdmin = async () => {
  if (!dbInitialized) return; // Skip if DB not initialized
  
  try {
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
  } catch (err) {
    console.error('Failed to ensure default admin:', err.message);
  }
};

// Middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://webthunghiep.vercel.app',        // Frontend
    'https://webthunghiepadmin.vercel.app',   // Admin
    'http://localhost:5173',                  // Local frontend dev
    'http://localhost:5174',                  // Local admin dev
    'http://localhost:3000',                  // Local fallback
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:3000'
  ];
  
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Max-Age', '86400');
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

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

// Health check/root route to avoid 404 on project root
app.get('/', (req, res) => {
  res.json({ message: 'Backend running' });
});

// Debug route: returns request info and environment checks
app.get('/_debug', (req, res) => {
  const routes = [];
  try {
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        // routes registered directly on the app
        const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
        routes.push({ path: middleware.route.path, methods });
      } else if (middleware.name === 'router' && middleware.handle.stack) {
        // router middleware
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
            routes.push({ path: handler.route.path, methods });
          }
        });
      }
    });
  } catch (e) {
    // ignore introspection errors
  }

  res.json({
    message: 'Debug info',
    path: req.originalUrl,
    method: req.method,
    env: {
      hasMongoUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV || null
    },
    routes
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler (include request path for easier debugging)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.originalUrl });
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

// Only run bootstrap (which starts a listening server) when this file is
// executed directly (e.g. `node server.js`). When imported by Vercel's
// serverless runtime, `require.main !== module` and we must NOT call
// `app.listen()` — Vercel will call the exported app as a function.
if (require.main === module) {
  bootstrap().catch((error) => {
    console.error('Failed to bootstrap server:', error.message);
    process.exit(1);
  });
}

module.exports = app;
