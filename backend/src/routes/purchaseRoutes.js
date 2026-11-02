import { Router } from 'express';
import {
  createPurchase,
  getPurchases,
  getExpiringPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase
} from '../controllers/purchaseController.js';
import { requireAuth } from '../middleware/auth.js';
import {
  validatePurchaseCreate,
  validatePurchaseUpdate,
  validateObjectId
} from '../middleware/validate.js';

const router = Router();

router.use(requireAuth);

router.get('/', getPurchases);
router.post('/', validatePurchaseCreate, createPurchase);

router.get('/expiring', getExpiringPurchases);

router.get('/:id', validateObjectId, getPurchaseById);
router.patch('/:id', validateObjectId, validatePurchaseUpdate, updatePurchase);
router.delete('/:id', validateObjectId, deletePurchase);

export default router;
