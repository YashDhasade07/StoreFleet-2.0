import express from 'express';
import {
  getUserProfile,
  updatePassword,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Routes for all authenticated users
router.get('/profile', getUserProfile);
router.put('/password', updatePassword);

// Admin only routes
router.get('/', checkRole(['system_admin']), getAllUsers);
router.get('/:id', checkRole(['system_admin']), getUserById);
router.post('/', checkRole(['system_admin']), createUser);
router.put('/:id', checkRole(['system_admin']), updateUser);
router.delete('/:id', checkRole(['system_admin']), deleteUser);

export default router;
