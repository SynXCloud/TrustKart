import Product from '../models/Product.js';

// @desc    Fetch all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, rating, search, seller } = req.query;

    let query = {};

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    if (seller) query.seller = seller;
    
    // Price Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating Filter
    if (rating) {
      query.ratings = { $gte: Number(rating) };
    }

    const products = await Product.find(query).populate('seller', 'name avatar trustScore');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name avatar trustScore createdAt');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
export const createProduct = async (req, res) => {
  try {
    const {
      title, price, description, images, videos, category, stock, productStory, deliveryInfo
    } = req.body;

    const product = new Product({
      title,
      price,
      description,
      images,
      videos,
      category,
      stock,
      productStory,
      deliveryInfo,
      seller: req.user._id,
      trustScore: req.user.trustScore || 0, // In step 9 this will be dynamic
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if user is the seller of the product or admin
      if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'User not authorized to update this product' });
      }

      product.title = req.body.title || product.title;
      product.price = req.body.price || product.price;
      product.description = req.body.description || product.description;
      product.images = req.body.images || product.images;
      product.videos = req.body.videos || product.videos;
      product.category = req.body.category || product.category;
      product.stock = req.body.stock || product.stock;
      product.productStory = req.body.productStory || product.productStory;
      product.deliveryInfo = req.body.deliveryInfo || product.deliveryInfo;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'User not authorized to delete this product' });
      }

      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
