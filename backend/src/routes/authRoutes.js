import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login } from '../controllers/authController.js';
const router = Router();
router.post('/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Muitas tentativas. Tente novamente mais tarde.' } }), (req, res, next) => Promise.resolve(login(req, res)).catch(next));
export default router;
