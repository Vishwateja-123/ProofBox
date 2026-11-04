import path from 'path';
import fs from 'fs';
import multer from 'multer';
import ReceiptFile from '../models/ReceiptFile.js';

// Ensure uploads directory exists for local caching
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Memory storage keeps buffer in memory so we can save to MongoDB Atlas & disk
const storage = multer.memoryStorage();

// File filter: only safe images and PDF
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WEBP, GIF, and PDF documents are supported as receipts.'), false);
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

/**
 * Handle receipt file upload
 * POST /api/receipts/upload
 */
export async function uploadReceiptFile(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file was uploaded.'
    });
  }

  const ext = path.extname(req.file.originalname).toLowerCase();
  const safeBase = path.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `receipt-${safeBase}-${uniqueSuffix}${ext}`;

  // 1. Write to local disk cache
  try {
    const localPath = path.resolve(uploadsDir, filename);
    fs.writeFileSync(localPath, req.file.buffer);
  } catch (err) {
    // Non-fatal if local disk is restricted
  }

  // 2. Persist permanently to MongoDB Atlas
  try {
    await ReceiptFile.findOneAndUpdate(
      { filename },
      {
        filename,
        originalName: req.file.originalname,
        contentType: req.file.mimetype || 'application/octet-stream',
        size: req.file.size,
        data: req.file.buffer
      },
      { upsert: true, new: true }
    );
  } catch (dbErr) {
    console.error('Error saving receipt to MongoDB Atlas:', dbErr);
  }

  // Generate accessible local URL
  const fileUrl = `/uploads/${filename}`;

  return res.status(200).json({
    success: true,
    message: 'Receipt uploaded successfully.',
    receiptUrl: fileUrl,
    filename,
    size: req.file.size
  });
}
