import express from 'express';
import {
  getDashboardStats,
  getAllUsersAdmin,
  getAllStoresAdmin,
  getAllRatingsAdmin
} from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

// All admin routes require system admin role
router.use(authenticateToken, checkRole(['system_admin']));

// Dashboard and statistics
router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsersAdmin);
router.get('/stores', getAllStoresAdmin);
router.get('/ratings', getAllRatingsAdmin);

export default router;
