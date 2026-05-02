const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (error.message.includes('querySrv ECONNREFUSED')) {
      console.error('Atlas SRV DNS lookup failed. Verify DNS/network or Atlas Network Access rules.');
    }
    // Don't exit the process in serverless environments — throw instead
    throw error;
  }
};

module.exports = connectDB;