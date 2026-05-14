import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiStar, FiHeart } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

const mockProducts = [
  {
    _id: '1',
    title: 'Handcrafted Leather Weekend Bag',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviews: 124,
    seller: 'ArtisanWorks',
    verified: true,
  },
  {
    _id: '2',
    title: 'Minimalist Ceramic Vase Set',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: 89,
    seller: 'Earth & Clay',
    verified: true,
  },
  {
    _id: '3',
    title: 'Organic Cotton Throw Blanket',
    price: 75.50,
    image: 'https://images.unsplash.com/photo-1580828369019-3221cfb69e57?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviews: 56,
    seller: 'EcoHome',
    verified: true,
  },
  {
    _id: '4',
    title: 'Walnut Wood Desk Organizer',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    reviews: 210,
    seller: 'WoodCraft Studio',
    verified: true,
  },
];

const TrendingProducts = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-text">Trending Products</h2>
            <p className="mt-2 text-muted">Highly rated items from our most trusted sellers.</p>
          </div>
        </div>

        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x hide-scrollbar">
          {mockProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="min-w-[280px] w-[280px] sm:min-w-[300px] sm:w-[300px] flex-shrink-0 snap-start"
            >
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-colors z-10">
                    <FiHeart size={18} />
                  </button>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/products/${product._id}`} className="text-lg font-bold text-text hover:text-primary transition-colors line-clamp-1">
                      {product.title}
                    </Link>
                  </div>
                  
                  <div className="flex items-center text-sm mb-3">
                    <span className="text-muted mr-1">by</span>
                    <span className="font-medium text-gray-800">{product.seller}</span>
                    {product.verified && (
                      <MdVerified className="text-blue-500 ml-1" title="Verified Seller" size={16} />
                    )}
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <FiStar className="text-yellow-400 fill-current" size={16} />
                    <span className="ml-1 font-medium text-sm text-gray-700">{product.rating}</span>
                    <span className="ml-1 text-sm text-gray-400">({product.reviews})</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-text">${product.price.toFixed(2)}</span>
                    <button className="bg-gray-100 hover:bg-primary hover:text-white text-text font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
