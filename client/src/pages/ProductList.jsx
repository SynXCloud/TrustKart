import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productsSlice';
import ProductCard from '../components/ProductCard';
import SkeletonProductCard from '../components/SkeletonProductCard';
import { FiFilter, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

const ProductList = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';
  const categoryKeyword = searchParams.get('category') || '';

  const { products, loading, error } = useSelector((state) => state.products);
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: categoryKeyword,
    minPrice: '',
    maxPrice: '',
    rating: '',
    search: searchKeyword,
  });

  const categories = ['Handmade Crafts', 'Premium Fashion', 'Eco-Friendly', 'Tech Accessories'];

  useEffect(() => {
    // Update filters if URL params change
    setFilters(prev => ({ ...prev, search: searchKeyword, category: categoryKeyword || prev.category }));
  }, [searchKeyword, categoryKeyword]);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', rating: '', search: searchKeyword });
  };

  // Mock products if backend returns empty (for UI testing purposes before DB is seeded)
  const displayProducts = products.length > 0 ? products : [
    { _id: '1', title: 'Sample Handmade Item', price: 99.99, images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&w=600&q=80'], ratings: 4.8, reviews: [], seller: { name: 'TrustKart Demo', trustScore: 90 }, badges: ['Handmade'] },
    { _id: '2', title: 'Sample Eco Product', price: 45.00, images: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&w=600&q=80'], ratings: 4.5, reviews: [], seller: { name: 'GreenLife', trustScore: 85 }, badges: ['Eco Friendly'] }
  ];

  const SidebarContent = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-text">Filters</h3>
        <button onClick={clearFilters} className="text-sm text-primary hover:underline">Clear All</button>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="radio" 
                name="category" 
                value={cat}
                checked={filters.category === cat}
                onChange={handleFilterChange}
                className="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="text-gray-600 group-hover:text-primary transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Price Range</h4>
        <div className="flex items-center space-x-2">
          <input 
            type="number" 
            name="minPrice" 
            placeholder="Min" 
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
          />
          <span className="text-gray-500">-</span>
          <input 
            type="number" 
            name="maxPrice" 
            placeholder="Max" 
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
          />
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Minimum Rating</h4>
        <select 
          name="rating" 
          value={filters.rating} 
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm bg-white"
        >
          <option value="">Any Rating</option>
          <option value="4">4 Stars & Above</option>
          <option value="3">3 Stars & Above</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-text">All Products</h1>
            {filters.search && <p className="text-gray-500 mt-2">Showing results for "{filters.search}"</p>}
          </div>
          <button 
            className="lg:hidden flex items-center space-x-2 text-gray-600 hover:text-primary"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <FiFilter />
            <span className="font-medium">Filter</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-1/4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <SidebarContent />
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {isMobileFiltersOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setIsMobileFiltersOpen(false)}
                />
                <motion.div 
                  initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                  transition={{ type: 'tween' }}
                  className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white z-50 p-6 overflow-y-auto lg:hidden"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                      <FiX size={20} />
                    </button>
                  </div>
                  <SidebarContent />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="w-full lg:w-3/4">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center mb-6">
                {error}
              </div>
            )}
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => <SkeletonProductCard key={n} />)}
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="mt-6 bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductList;
