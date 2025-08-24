import express from 'express';
import {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  searchStores,
  getMyStore,
  getMyStores
} from '../controllers/storeController.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router(); 

// All routes require authentication 
router.use(authenticateToken);

// Routes for all authenticated users
router.get('/', getAllStores);
router.get('/search', searchStores);
router.get('/mystores',checkRole(['store_owner']), getMyStores);
router.get('/my/store', checkRole(['store_owner']), getMyStore);
router.get('/:id', getStoreById);

// Store owner routes
// Add this route for store owners


// Admin only routes
router.post('/', checkRole(['system_admin']), createStore);
router.put('/:id', checkRole(['system_admin']), updateStore);
router.delete('/:id', checkRole(['system_admin']), deleteStore);

export default router;
