import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
   
    await connectDB();

  
    const server = app.listen(PORT, () => {
      console.log('==================================================');
      console.log(`🚀 ProofBox API Server running on http://localhost:${PORT}`);
      console.log(`🛡️  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
      console.log('==================================================');
    });

   
    const shutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error(`[Server] Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

startServer();
