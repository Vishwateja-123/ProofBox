import path from 'path';
import fs from 'fs';
import multer from 'multer';

// Ensure uploads directory exists
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `receipt-${safeBase}-${uniqueSuffix}${ext}`);
  }
});

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
export function uploadReceiptFile(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file was uploaded.'
    });
  }

  // Generate accessible local URL
  const fileUrl = `/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: 'Receipt uploaded successfully.',
    receiptUrl: fileUrl,
    filename: req.file.filename,
    size: req.file.size
  });
}
