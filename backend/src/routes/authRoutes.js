import { Router } from 'express';
import {
  register,
  login,
  logout,
  getProfile
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authRateLimiter, validateRegister, register);
router.post('/login', authRateLimiter, validateLogin, login);

router.post('/logout', requireAuth, logout);
router.get('/profile', requireAuth, getProfile);
router.get('/me', requireAuth, getProfile);

export default router;
