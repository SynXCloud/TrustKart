import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  toggleWishlist
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes in this file require auth

router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

router.route('/wishlist')
  .post(toggleWishlist);

export default router;
