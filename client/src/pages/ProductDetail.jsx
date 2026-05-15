import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, clearProductDetails } from '../redux/slices/productsSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiHeart, FiShoppingCart, FiShield, FiTruck, FiCornerUpLeft } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { productDetails: product, loading, error } = useSelector((state) => state.products);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  // Mock product fallback for UI testing before DB is seeded
  const displayProduct = product || {
    _id: id,
    title: 'Handcrafted Leather Weekend Bag',
    price: 129.99,
    description: 'A beautifully crafted weekend bag made from premium full-grain leather. Features solid brass hardware, a spacious interior lined with durable canvas, and an adjustable shoulder strap. Perfect for short trips and daily use.',
    productStory: 'This bag was designed in our small studio in Portland, Oregon. We wanted to create a timeless piece that gets better with age. Each bag takes about 14 hours to hand-stitch, ensuring the highest quality and durability.',
    deliveryInfo: 'Ships within 2-3 business days. Free shipping on orders over $100.',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&w=800&q=80',
    ],
    ratings: 4.9,
    reviews: new Array(124).fill({}),
    badges: ['Handmade', 'Top Rated'],
    stock: 5,
    seller: {
      name: 'ArtisanWorks',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&w=200&q=80',
      trustScore: 98,
      createdAt: '2022-01-15T00:00:00.000Z'
    }
  };

  if (loading && !product) {
    return (
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="animate-pulse flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 h-[500px] bg-gray-200 rounded-2xl"></div>
          <div className="w-full md:w-1/2 space-y-6">
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link> &rsaquo; 
          <Link to="/products" className="mx-2 hover:text-primary transition-colors">Products</Link> &rsaquo; 
          <span className="mx-2 text-gray-800">{displayProduct.title}</span>
        </nav>

        {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-8">{error}</div>}

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mb-4 group cursor-zoom-in">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={displayProduct.images[activeImage] || 'https://via.placeholder.com/800?text=No+Image'}
                  alt={displayProduct.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </AnimatePresence>
              
              {/* Badges */}
              {displayProduct.badges && displayProduct.badges.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {displayProduct.badges.map((badge, idx) => (
                    <span key={idx} className="bg-accent text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {displayProduct.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2">
                {displayProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight mb-4">
              {displayProduct.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-400">
                <FiStar className="fill-current" size={20} />
                <span className="ml-1.5 font-bold text-gray-800 text-lg">{displayProduct.ratings?.toFixed(1) || '0.0'}</span>
              </div>
              <span className="text-gray-300">|</span>
              <a href="#reviews" className="text-primary font-medium hover:underline">
                {displayProduct.reviews?.length || 0} Reviews
              </a>
              <span className="text-gray-300">|</span>
              <span className={`font-medium ${displayProduct.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {displayProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="text-4xl font-bold text-text mb-8">
              ${displayProduct.price?.toFixed(2)}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              {displayProduct.description}
            </p>

            {/* Actions */}
            <div className="flex gap-4 mb-10">
              <button 
                disabled={displayProduct.stock === 0}
                className="flex-1 bg-primary hover:bg-emerald-600 text-white font-medium py-4 px-8 rounded-xl shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <FiShoppingCart size={20} />
                {displayProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="w-14 h-14 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 flex items-center justify-center rounded-xl transition-colors border border-gray-200">
                <FiHeart size={24} />
              </button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="bg-white p-2 rounded-full text-primary shadow-sm"><FiTruck size={20} /></div>
                <div>
                  <h4 className="font-bold text-sm text-text">Delivery</h4>
                  <p className="text-xs text-gray-500">{displayProduct.deliveryInfo || 'Standard shipping'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="bg-white p-2 rounded-full text-primary shadow-sm"><FiCornerUpLeft size={20} /></div>
                <div>
                  <h4 className="font-bold text-sm text-text">Returns</h4>
                  <p className="text-xs text-gray-500">7-day easy returns</p>
                </div>
              </div>
            </div>

            {/* Seller Card */}
            {displayProduct.seller && (
              <div className="mt-auto border border-gray-200 rounded-2xl p-6 bg-white shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={displayProduct.seller.avatar || 'https://via.placeholder.com/150'} alt={displayProduct.seller.name} className="w-16 h-16 rounded-full object-cover" />
                    {displayProduct.seller.trustScore >= 80 && (
                      <MdVerified className="absolute bottom-0 right-0 text-blue-500 bg-white rounded-full" size={20} title="Verified Seller" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text">Sold by {displayProduct.seller.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <span className="text-gray-500">Trust Score:</span>
                      <span className={`font-bold ${displayProduct.seller.trustScore >= 90 ? 'text-emerald-500' : 'text-blue-500'}`}>
                        {displayProduct.seller.trustScore}/100
                      </span>
                    </div>
                  </div>
                </div>
                <Link to={`/sellers/${displayProduct.seller._id}`} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition-colors hidden sm:block">
                  View Shop
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Product Story */}
        {displayProduct.productStory && (
          <div className="mt-20 border-t border-gray-100 pt-16 max-w-4xl">
            <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
              <FiShield className="text-primary" /> The Story Behind the Product
            </h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              <p>{displayProduct.productStory}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
