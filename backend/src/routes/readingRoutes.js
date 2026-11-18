import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { listReadings, createReading, getReading, updateReading, deleteReading } from '../controllers/readingsController.js';
const router = Router();
router.use(requireAuth);
router.route('/').get(listReadings).post(createReading);
router.route('/:id').get(getReading).put(updateReading).delete(deleteReading);
export default router;
