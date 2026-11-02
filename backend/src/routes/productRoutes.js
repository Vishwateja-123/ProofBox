import { Router } from 'express';
import { searchProducts, getPopularProducts } from '../controllers/productController.js';

const router = Router();

// Public endpoints (no auth required so users can preview products smoothly)
router.get('/search', searchProducts);
router.get('/popular', getPopularProducts);

export default router;
