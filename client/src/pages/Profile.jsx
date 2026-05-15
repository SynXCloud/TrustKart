import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';
import { fetchWishlist, toggleWishlistItem } from '../redux/slices/wishlistSlice';
import api from '../services/api';
import { FiUser, FiPackage, FiHeart, FiSettings, FiCamera } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { items: wishlistItems, loading: wishlistLoading } = useSelector((state) => state.wishlist);
  
  const [activeTab, setActiveTab] = useState('account');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  
  const [updateMsg, setUpdateMsg] = useState(null);

  useEffect(() => {
    // Load profile data on mount
    const loadProfileData = async () => {
      try {
        setOrdersLoading(true);
        const { data } = await api.get('/users/profile');
        setOrders(data.orders || []);
        // Wishlist is handled by redux
        dispatch(fetchWishlist());
        setOrdersLoading(false);
      } catch (error) {
        console.error(error);
        setOrdersLoading(false);
      }
    };
    loadProfileData();
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return setUpdateMsg({ type: 'error', text: 'Passwords do not match' });
    }
    
    const updateData = { name: formData.name, email: formData.email };
    if (formData.password) updateData.password = formData.password;
    
    const resultAction = await dispatch(updateProfile(updateData));
    if (updateProfile.fulfilled.match(resultAction)) {
      setUpdateMsg({ type: 'success', text: 'Profile updated successfully!' });
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } else {
      setUpdateMsg({ type: 'error', text: resultAction.payload || 'Failed to update profile' });
    }
    
    setTimeout(() => setUpdateMsg(null), 3000);
  };

  const tabs = [
    { id: 'account', label: 'Account Details', icon: <FiUser /> },
    { id: 'orders', label: 'Order History', icon: <FiPackage /> },
    { id: 'wishlist', label: 'My Wishlist', icon: <FiHeart /> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
          <div className="relative group cursor-pointer">
            <img src={user?.avatar} alt={user?.name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-50" />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <FiCamera className="text-white" size={24} />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-text mb-1">{user?.name}</h1>
            <p className="text-gray-500 mb-2">{user?.email}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <FiSettings size={14} /> {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)} Account
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Nav */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-28">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-left font-medium transition-colors border-l-4 ${activeTab === tab.id ? 'border-primary bg-primary/5 text-primary' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px]"
              >
                
                {/* ACCOUNT TAB */}
                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-xl font-bold text-text mb-6">Account Details</h2>
                    {updateMsg && (
                      <div className={`p-4 rounded-lg mb-6 ${updateMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                        {updateMsg.text}
                      </div>
                    )}
                    <form onSubmit={handleUpdateProfile} className="max-w-xl space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50" />
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-800 mb-4">Password Change (Optional)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50" />
                          </div>
                        </div>
                      </div>
                      
                      <button type="submit" disabled={authLoading} className="mt-6 px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50">
                        {authLoading ? 'Updating...' : 'Save Changes'}
                      </button>
                    </form>
                  </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-xl font-bold text-text mb-6">Order History</h2>
                    {ordersLoading ? (
                      <div className="text-center py-10 text-gray-500">Loading orders...</div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                          <FiPackage size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">No orders yet</h3>
                        <p className="text-gray-500">You haven't placed any orders.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div key={order._id} className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-200 text-sm">
                              <div>
                                <p className="text-gray-500 mb-1">Order Placed</p>
                                <p className="font-medium text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">Total</p>
                                <p className="font-medium text-gray-800">${order.totalPrice.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">Status</p>
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 
                                  order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-500 mb-1">Order ID</p>
                                <p className="font-mono text-gray-600">{order._id.substring(order._id.length - 8)}</p>
                              </div>
                            </div>
                            <div className="px-6 py-4">
                              {order.orderItems.map((item, idx) => (
                                <div key={idx} className="flex gap-4 py-2">
                                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-gray-100" />
                                  <div>
                                    <p className="font-medium text-text text-sm">{item.name}</p>
                                    <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* WISHLIST TAB */}
                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="text-xl font-bold text-text mb-6">My Wishlist</h2>
                    {wishlistLoading ? (
                      <div className="text-center py-10 text-gray-500">Loading wishlist...</div>
                    ) : wishlistItems.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                          <FiHeart size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500">Save items you love to build your wishlist.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistItems.map((product) => (
                          <ProductCard key={product._id} product={product} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
