import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MdVerified } from 'react-icons/md';

const mockSellers = [
  {
    id: 's1',
    name: 'ArtisanWorks',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    niche: 'Handcrafted Leather',
    trustScore: 98,
    level: 'Highly Trusted',
    color: 'bg-emerald-500'
  },
  {
    id: 's2',
    name: 'Earth & Clay',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    niche: 'Ceramics & Pottery',
    trustScore: 92,
    level: 'Highly Trusted',
    color: 'bg-emerald-500'
  },
  {
    id: 's3',
    name: 'EcoHome',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    niche: 'Sustainable Living',
    trustScore: 85,
    level: 'Trusted',
    color: 'bg-blue-500'
  }
];

const SellerSpotlight = () => {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text mb-4">Verified Sellers Spotlight</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Meet the creators and businesses who consistently deliver quality products and exceptional service, backed by our dynamic Trust Score system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockSellers.map((seller, index) => (
            <motion.div
              key={seller.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="relative inline-block mb-4">
                <img 
                  src={seller.avatar} 
                  alt={seller.name} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
                <MdVerified className="absolute bottom-0 right-0 text-blue-500 bg-white rounded-full" size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-text mb-1">{seller.name}</h3>
              <p className="text-sm text-gray-500 mb-6">{seller.niche}</p>
              
              {/* Trust Score Bar */}
              <div className="mb-6 text-left">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Trust Score</span>
                  <span className={`text-sm font-bold ${seller.trustScore >= 90 ? 'text-emerald-500' : 'text-blue-500'}`}>
                    {seller.trustScore}/100
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <motion.div 
                    className={`${seller.color} h-2 rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${seller.trustScore}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                  />
                </div>
                <div className="mt-2 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${seller.trustScore >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                    {seller.level}
                  </span>
                </div>
              </div>

              <Link to={`/sellers/${seller.id}`} className="inline-block w-full py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-text hover:bg-gray-50 hover:border-gray-300 transition-colors">
                View Profile
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SellerSpotlight;
