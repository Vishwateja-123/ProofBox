import mongoose from 'mongoose';

/**
 * Connect to MongoDB instance
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/proofbox';

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true, // Build indexes automatically in development
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    throw error;
  }
}

/**
 * Disconnect from MongoDB instance (used in tests and graceful shutdown)
 */
export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected successfully');
  } catch (error) {
    console.error(`[MongoDB] Error disconnecting: ${error.message}`);
  }
}
