import { Router } from 'express';
import { uploadReceiptFile, uploadMiddleware } from '../controllers/receiptController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();


router.post('/upload', requireAuth, uploadMiddleware.single('receipt'), uploadReceiptFile);

export default router;
