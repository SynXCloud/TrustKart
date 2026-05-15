import User from '../models/User.js';
import Order from '../models/Order.js';

// @desc    Get user profile, wishlist, and orders
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'title price images ratings reviews seller',
      populate: { path: 'seller', select: 'name trustScore' }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Also fetch orders for this user
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      trustScore: user.trustScore,
      wishlist: user.wishlist,
      orders: orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      if (req.body.avatar) {
        user.avatar = req.body.avatar;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        trustScore: updatedUser.trustScore
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle product in wishlist
// @route   POST /api/users/wishlist
// @access  Private
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.wishlist.indexOf(productId);
    
    if (index === -1) {
      // Add to wishlist
      user.wishlist.push(productId);
    } else {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
    }

    await user.save();
    
    // Return populated wishlist
    const updatedUser = await User.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'title price images ratings reviews seller',
      populate: { path: 'seller', select: 'name trustScore' }
    });

    res.json(updatedUser.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
