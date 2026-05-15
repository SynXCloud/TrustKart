import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

const seedProducts = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected!');

    // Get a seller user to assign products to
    let seller = await User.findOne({ role: 'seller' });
    
    // If no seller exists, just get the first user
    if (!seller) {
      seller = await User.findOne();
      if (!seller) {
        console.error('No users found in the database. Please register a user first.');
        process.exit(1);
      }
      // Upgrade them to a seller
      seller.role = 'seller';
      await seller.save();
    }

    console.log(`Assigning products to seller: ${seller.name}`);

    // Clear existing products (optional, but good for a fresh start. We'll leave it out to not delete their test data)
    // await Product.deleteMany();
    // console.log('Existing products cleared.');

    console.log('Fetching products from DummyJSON API...');
    const response = await fetch('https://dummyjson.com/products?limit=150');
    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      console.error('Failed to fetch products from API.');
      process.exit(1);
    }

    const productsToInsert = data.products.map(item => ({
      title: item.title,
      price: item.price,
      description: item.description,
      images: item.images.length > 0 ? item.images : [item.thumbnail],
      category: item.category,
      stock: item.stock,
      ratings: item.rating,
      numReviews: item.reviews ? item.reviews.length : 0,
      seller: seller._id,
      trustScore: seller.trustScore || 100,
      badges: item.rating > 4.5 ? ['Top Rated'] : [],
      productStory: `This high-quality ${item.title} brings exceptional value and performance. Sourced and vetted by our top sellers, it features a durable build and incredible utility.`,
      deliveryInfo: 'Ships within 2-3 business days. Free shipping on orders over $100.',
    }));

    console.log(`Inserting ${productsToInsert.length} products into the database...`);
    await Product.insertMany(productsToInsert);
    
    console.log('✅ Seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedProducts();
