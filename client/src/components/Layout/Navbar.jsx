import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const cartItemsCount = cart?.items?.length || 0; 
  const wishlistItemsCount = 0;

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleCartOpen = (e) => {
    e.preventDefault();
    import('../../redux/slices/cartSlice').then(({ toggleCart }) => {
      dispatch(toggleCart(true));
    });
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'Sellers', path: '/sellers' },
  ];

  const isHome = location.pathname === '/';
  const navBg = isHome && !isScrolled ? 'bg-transparent text-white' : 'bg-white shadow-md text-text';
  const logoColor = isHome && !isScrolled ? 'text-white' : 'text-primary';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className={`text-2xl font-bold font-inter tracking-tight flex items-center gap-2 ${logoColor}`}>
              <span className="bg-primary text-white p-1.5 rounded-lg text-lg">TK</span>
              TrustKart
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className="font-medium hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search Bar (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, categories..." 
                className={`w-full py-2.5 pl-10 pr-4 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary ${isHome && !isScrolled ? 'bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white focus:text-text' : 'bg-gray-50 border-gray-200 text-text'}`}
              />
              <button type="submit" className={`absolute left-3.5 top-3 ${isHome && !isScrolled ? 'text-white' : 'text-gray-400'}`}>
                <FiSearch size={18} />
              </button>
            </form>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/wishlist" className="relative hover:text-primary transition-colors">
              <FiHeart size={22} />
              {wishlistItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistItemsCount}
                </span>
              )}
            </Link>
            
            <a href="#" onClick={handleCartOpen} className="relative hover:text-primary transition-colors cursor-pointer">
              <FiShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </a>

            {isAuthenticated ? (
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-2 hover:text-primary transition-colors">
                  <img src={user?.avatar || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"} alt="avatar" className="w-8 h-8 rounded-full border-2 border-primary" />
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block border border-gray-100">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                  {user?.role === 'seller' && (
                    <Link to="/seller/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Seller Dashboard</Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Panel</Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 hover:text-primary transition-colors font-medium">
                <FiUser size={22} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <a href="#" onClick={handleCartOpen} className="relative cursor-pointer">
              <FiShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </a>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white text-text shadow-xl border-t border-gray-100"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <form onSubmit={handleSearch} className="py-3 px-2">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..." 
                  className="w-full py-2 px-4 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-primary text-text"
                />
              </form>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-3 rounded-md text-base font-medium hover:bg-gray-50 hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-4 pb-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center px-3 mb-4">
                      <img src={user?.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <div className="font-medium text-base text-gray-800">{user?.name}</div>
                        <div className="font-medium text-sm text-gray-500">{user?.email}</div>
                      </div>
                    </div>
                    <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Profile</Link>
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50">Logout</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-gray-50">
                    Sign In / Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
