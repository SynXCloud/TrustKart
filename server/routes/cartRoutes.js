import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All cart routes require authentication

router.route('/').get(getCart);
router.route('/add').post(addToCart);
router.route('/update').put(updateCartItem);
router.route('/remove/:productId').delete(removeFromCart);
router.route('/clear').delete(clearCart);

export default router;
