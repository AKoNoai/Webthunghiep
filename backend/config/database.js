const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if already connected
  if (cachedConnection && cachedConnection.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,  // 5 seconds - short timeout for Vercel
      socketTimeoutMS: 5000,            // 5 seconds socket timeout
      bufferCommands: false,             // Don't buffer commands if disconnected
      maxPoolSize: 2,                    // Minimal pool for serverless
      connectTimeoutMS: 5000,
      family: 4,
    });
    
    cachedConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (error.message.includes('querySrv ECONNREFUSED')) {
      console.error('Atlas SRV DNS lookup failed. Verify DNS/network or Atlas Network Access rules.');
    }
    if (error.message.includes('MONGODB_URI')) {
      console.error('CRITICAL: MONGODB_URI is not configured in environment variables.');
    }
    throw error;
  }
};

module.exports = connectDB;