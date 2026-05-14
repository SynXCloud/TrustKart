import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative bg-accent overflow-hidden h-screen max-h-[800px] min-h-[600px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
          alt="Premium Marketplace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-accent/90 to-accent/40 mix-blend-multiply" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-semibold tracking-wide mb-4">
              Premium Marketplace
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6"
          >
            Only Genuine Products. <br/>
            <span className="text-primary">Only Trusted Sellers.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl"
          >
            Discover curated, high-quality items from verified local and handmade creators. Experience shopping with absolute confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg text-white bg-primary hover:bg-emerald-600 shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              Start Shopping
            </Link>
            <Link
              to="/sellers"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-300"
            >
              Meet Our Sellers
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-12 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-accent" src="https://randomuser.me/api/portraits/women/11.jpg" alt="user" />
              <img className="w-10 h-10 rounded-full border-2 border-accent" src="https://randomuser.me/api/portraits/men/32.jpg" alt="user" />
              <img className="w-10 h-10 rounded-full border-2 border-accent" src="https://randomuser.me/api/portraits/women/44.jpg" alt="user" />
              <div className="w-10 h-10 rounded-full border-2 border-accent bg-gray-800 flex items-center justify-center text-xs text-white font-medium">+10k</div>
            </div>
            <p className="text-sm text-gray-400 font-medium">Trusted by <span className="text-white">10,000+</span> buyers worldwide.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
