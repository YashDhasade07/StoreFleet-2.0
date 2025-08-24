import express from 'express';
import {
  submitRating,
  updateRating,
  deleteRating,
  getMyRatings,
  getStoreRatings,
  getAllRatings
} from '../controllers/ratingController.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Routes for normal users
router.post('/', checkRole(['normal_user']), submitRating);
router.put('/:id', checkRole(['normal_user']), updateRating);
router.delete('/:id', checkRole(['normal_user']), deleteRating);
router.get('/my', checkRole(['normal_user']), getMyRatings);


router.get('/store/:storeId', getStoreRatings);

// Admin only routes
router.get('/', checkRole(['system_admin']), getAllRatings);

export default router;
