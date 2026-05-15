import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white max-w-lg w-full p-10 rounded-3xl shadow-xl text-center border border-gray-100"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 10 }}
          className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FiCheckCircle size={48} />
        </motion.div>
        
        <h1 className="text-3xl font-extrabold text-text mb-4">Payment Successful!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Thank you for your purchase. We've received your order and are currently processing it. A confirmation email has been sent to your inbox.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products" className="px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors shadow-md shadow-primary/20">
            Continue Shopping
          </Link>
          <Link to="/profile" className="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">
            View My Orders
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
