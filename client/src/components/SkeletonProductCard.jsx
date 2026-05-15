import React from 'react';
import { motion } from 'framer-motion';

const SkeletonProductCard = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-64 bg-gray-200 w-full"></div>
      <div className="p-5">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductCard;
