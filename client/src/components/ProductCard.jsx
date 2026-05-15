import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiStar } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

const ProductCard = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col h-full"
    >
      <div className="relative h-64 overflow-hidden bg-gray-50 flex-shrink-0">
        <img
          src={product.images[0] || 'https://via.placeholder.com/400?text=No+Image'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-colors z-10 shadow-sm">
          <FiHeart size={18} />
        </button>
        
        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.badges.map((badge, idx) => (
              <span key={idx} className="bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/products/${product._id}`} className="text-lg font-bold text-text hover:text-primary transition-colors line-clamp-2 mb-2">
          {product.title}
        </Link>
        
        <div className="flex items-center text-sm mb-3">
          <span className="text-muted mr-1">by</span>
          <span className="font-medium text-gray-800">{product.seller?.name || 'Unknown Seller'}</span>
          {product.seller?.trustScore >= 80 && (
            <MdVerified className="text-blue-500 ml-1" title="Verified Seller" size={16} />
          )}
        </div>
        
        <div className="flex items-center mb-auto">
          <FiStar className="text-yellow-400 fill-current" size={16} />
          <span className="ml-1 font-medium text-sm text-gray-700">{product.ratings.toFixed(1)}</span>
          <span className="ml-1 text-sm text-gray-400">({product.reviews?.length || 0})</span>
        </div>
        
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-50">
          <span className="text-2xl font-bold text-text">${product.price.toFixed(2)}</span>
          <button className="bg-primary/10 text-primary hover:bg-primary hover:text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
