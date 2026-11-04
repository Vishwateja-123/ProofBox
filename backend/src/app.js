import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import receiptRoutes from './routes/receiptRoutes.js';
import ReceiptFile from './models/ReceiptFile.js';

import {
  errorHandler,
  notFoundHandler
} from './middleware/errorHandler.js';

import { apiRateLimiter } from './middleware/rateLimiter.js';

const app = express();

// Trust reverse proxy (required for Render, Vercel, and Cloudflare)
app.set('trust proxy', 1);

// 1. Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false
  })
);

 // 2. CORS configuration
 // Allow localhost and configured network addresses.
 const allowedOrigins = (
   process.env.CORS_ORIGIN || 'http://localhost:5173'
 )
   .split(',')
   .map((origin) => origin.trim())
   .filter(Boolean);

 // ADD THIS LINE HERE
 console.log('[CORS] Allowed origins:', allowedOrigins);

 app.use(
   cors({
     origin: function (origin, callback) {
       if (!origin) {
         return callback(null, true);
       }

       if (
         allowedOrigins.includes(origin) ||
         allowedOrigins.includes('*') ||
         origin.endsWith('.vercel.app')
       ) {
         return callback(null, true);
       }

       return callback(
         new Error(`Origin ${origin} not allowed by CORS`)
       );
     },

     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
     allowedHeaders: [
       'Content-Type',
       'Authorization',
       'X-Requested-With'
     ]
   })
 );

// 3. Cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// 4. Request body parsers
app.use(express.json({ limit: '10mb' }));
app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb'
  })
);

// 5. HTTP request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 6. Existing receipt serving (with MongoDB Atlas persistence fallback)
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.get('/uploads/:filename', async (req, res, next) => {
  const { filename } = req.params;
  const localPath = path.resolve(uploadsDir, filename);

  // Serve from local disk cache if present
  if (fs.existsSync(localPath)) {
    return res.sendFile(localPath);
  }

  // Fallback: fetch from MongoDB Atlas (persists across Render container restarts)
  try {
    const fileDoc = await ReceiptFile.findOne({ filename });
    if (fileDoc && fileDoc.data) {
      // Re-populate disk cache
      try {
        fs.writeFileSync(localPath, fileDoc.data);
      } catch (cacheErr) {
        // Non-fatal cache write failure
      }

      res.setHeader('Content-Type', fileDoc.contentType || 'application/octet-stream');
      res.setHeader('Content-Length', fileDoc.size || fileDoc.data.length);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.send(fileDoc.data);
    }
  } catch (err) {
    console.error('Error retrieving receipt from MongoDB Atlas:', err);
  }

  return next();
});

app.use('/uploads', express.static(uploadsDir));

// 7. API rate limiter
app.use('/api', apiRateLimiter);

// 8. Health check
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  res.status(isDbConnected ? 200 : 503).json({
    success: isDbConnected,
    status: isDbConnected ? 'healthy' : 'degraded',
    service: 'ProofBox API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      status: isDbConnected ? 'connected' : 'disconnected',
      host: mongoose.connection.host || 'unknown',
      name: mongoose.connection.name || 'unknown'
    }
  });
});

// 9. API routes
app.use('/api/auth', authRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/receipts', receiptRoutes);

// 10. Handle routes that do not exist
app.use(notFoundHandler);

// 11. Centralized error handling
app.use(errorHandler);

export default app;
