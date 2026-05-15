import express from 'express';
import {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').post(createOrder);
router.route('/myorders').get(getMyOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/verify').post(verifyPayment);

export default router;
