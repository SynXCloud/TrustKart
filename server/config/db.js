import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trustkart');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn("⚠️ Please add a valid MongoDB Atlas URI to your server/.env file as MONGO_URI, or ensure MongoDB is running locally.");
    // Removed process.exit(1) so the server stays up even if DB connection fails initially
  }
};

export default connectDB;
