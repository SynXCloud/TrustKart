import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-accent text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-primary text-white p-1.5 rounded-lg text-lg font-bold">TK</span>
              <span className="text-2xl font-bold font-inter tracking-tight">TrustKart</span>
            </div>
            <p className="text-gray-400 mb-6">
              Only Genuine Products. Only Trusted Sellers. Experience the premium marketplace for curated, high-quality items.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full"><FiFacebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full"><FiTwitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full"><FiInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full"><FiYoutube size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-gray-400 hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/categories" className="text-gray-400 hover:text-primary transition-colors">Top Categories</Link></li>
              <li><Link to="/sellers" className="text-gray-400 hover:text-primary transition-colors">Verified Sellers</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Customer Service</h3>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for exclusive offers and updates.</p>
            <form className="flex flex-col space-y-3">
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-primary hover:bg-emerald-600 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} TrustKart. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
