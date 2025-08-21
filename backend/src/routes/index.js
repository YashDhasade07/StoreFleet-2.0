import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import storeRoutes from './stores.js';
// import ratingRoutes from './ratings.js';
// import adminRoutes from './admin.js';

const router = express.Router();

// Route prefixes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/stores', storeRoutes);
// router.use('/ratings', ratingRoutes);
// router.use('/admin', adminRoutes);

export default router;
