import React from 'react';
import { FiShield, FiStar, FiLock, FiRefreshCw } from 'react-icons/fi';

const TrustBanner = () => {
  const trustItems = [
    {
      icon: <FiShield size={32} />,
      title: 'Verified Sellers',
      description: 'Every seller undergoes a strict verification process.',
    },
    {
      icon: <FiStar size={32} />,
      title: 'Real Reviews',
      description: 'Reviews only from verified buyers who purchased the item.',
    },
    {
      icon: <FiLock size={32} />,
      title: 'Secure Payments',
      description: 'Your money is safe with Razorpay end-to-end encryption.',
    },
    {
      icon: <FiRefreshCw size={32} />,
      title: 'Easy Returns',
      description: 'Hassle-free 7-day return policy on eligible items.',
    },
  ];

  return (
    <section className="py-16 bg-primary/5 border-y border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-white text-primary rounded-full flex items-center justify-center mb-4 shadow-sm border border-primary/10">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-text mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBanner;
