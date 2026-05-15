import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { toggleCart, updateCartItem, removeFromCart, fetchCart } from '../redux/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCartOpen, cart, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && isCartOpen) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, isCartOpen, dispatch]);

  const handleClose = () => dispatch(toggleCart(false));

  const handleUpdateQty = (productId, newQty, stock) => {
    if (newQty < 1) return;
    if (newQty > stock) return alert(`Only ${stock} items available`);
    dispatch(updateCartItem({ productId, quantity: newQty }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    handleClose();
    navigate('/checkout');
  };

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => acc + (item.product?.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-text flex items-center gap-2">
                <FiShoppingBag /> Your Cart <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full ml-1">{items.length}</span>
              </h2>
              <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <FiX size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!isAuthenticated ? (
                <div className="text-center py-12">
                  <FiShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-6">Please login to view your cart.</p>
                  <Link to="/login" onClick={handleClose} className="bg-primary text-white px-6 py-2 rounded-lg font-medium">Login</Link>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiShoppingBag size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                  <button onClick={handleClose} className="text-primary font-medium hover:underline">Continue Shopping</button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item._id} className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <img 
                      src={item.product?.images?.[0] || 'https://via.placeholder.com/100'} 
                      alt={item.product?.title} 
                      className="w-20 h-20 object-cover rounded-lg bg-white border border-gray-100"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-text text-sm line-clamp-1">{item.product?.title}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">by {item.product?.seller?.name}</p>
                        </div>
                        <button onClick={() => handleRemove(item.product?._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-text">${item.product?.price?.toFixed(2)}</span>
                        
                        {/* Quantity Control */}
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg">
                          <button 
                            onClick={() => handleUpdateQty(item.product?._id, item.quantity - 1, item.product?.stock)}
                            className="p-1.5 hover:bg-gray-50 text-gray-600 rounded-l-lg transition-colors"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQty(item.product?._id, item.quantity + 1, item.product?.stock)}
                            className="p-1.5 hover:bg-gray-50 text-gray-600 rounded-r-lg transition-colors"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {isAuthenticated && items.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-xl font-bold text-text">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mb-6 text-center">Taxes and shipping calculated at checkout</p>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
