import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
// Note: Requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
  });
};

// @desc    Create new order & Razorpay order instance
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // 1. Create DB Order (Unpaid)
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();

    // 2. Create Razorpay Order
    const razorpay = getRazorpayInstance();
    const options = {
      amount: Math.round(totalPrice * 100), // amount in the smallest currency unit (paise)
      currency: "USD", // Assuming USD for demonstration, can be INR
      receipt: `receipt_order_${createdOrder._id}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(201).json({
      order: createdOrder,
      razorpayOrder,
      keyId: process.env.RAZORPAY_KEY_ID // Send Key ID to frontend for checkout initialization
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/:id/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify Signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified successfully
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: 'Success',
        update_time: new Date().toISOString()
      };

      const updatedOrder = await order.save();

      // Clear user's cart upon successful payment
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

      res.json({ message: 'Payment verified successfully', order: updatedOrder });
    } else {
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      // Check if user is the owner or an admin
      if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
        res.json(order);
      } else {
        res.status(401).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
