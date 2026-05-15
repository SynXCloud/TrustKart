import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerProducts, deleteProduct, createProduct } from '../redux/slices/productsSlice';
import api from '../services/api';
import { FiBox, FiPlusCircle, FiTrendingUp, FiUploadCloud, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('overview');
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: 'Handmade Crafts',
    stock: '',
    images: [],
    productStory: '',
    deliveryInfo: ''
  });

  useEffect(() => {
    if (activeTab === 'products' || activeTab === 'overview') {
      dispatch(fetchSellerProducts());
    }
  }, [dispatch, activeTab]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append('image', file);

    try {
      setUploading(true);
      const { data } = await api.post('/upload', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, images: [...prev.images, data.imageUrl] }));
      setUploading(false);
    } catch (error) {
      console.error(error);
      setMsg({ type: 'error', text: 'Image upload failed. Check Cloudinary settings.' });
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      return setMsg({ type: 'error', text: 'Please upload at least one image' });
    }

    const newProduct = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    const resultAction = await dispatch(createProduct(newProduct));
    if (createProduct.fulfilled.match(resultAction)) {
      setMsg({ type: 'success', text: 'Product created successfully!' });
      setFormData({
        title: '', price: '', description: '', category: 'Handmade Crafts', stock: '', images: [], productStory: '', deliveryInfo: ''
      });
      setActiveTab('products');
    } else {
      setMsg({ type: 'error', text: resultAction.payload || 'Failed to create product' });
    }
    
    setTimeout(() => setMsg(null), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: <FiTrendingUp /> },
    { id: 'products', label: 'My Products', icon: <FiBox /> },
    { id: 'add', label: 'Add New Product', icon: <FiPlusCircle /> },
  ];

  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text mb-1">{user?.name}'s Shop</h1>
            <p className="text-gray-500">Manage your inventory and sales</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-gray-500">Trust Score</p>
            <p className="text-xl font-bold text-emerald-500">{user?.trustScore || 100}/100</p>
          </div>
        </div>

        {msg && (
          <div className={`p-4 rounded-xl mb-6 font-medium ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {msg.text}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
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
                
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-xl font-bold text-text mb-6">Store Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-2">
                          <FiBox className="text-primary" size={24} />
                          <h3 className="text-gray-600 font-medium">Total Products</h3>
                        </div>
                        <p className="text-3xl font-extrabold text-primary">{products.length}</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-2">
                          <FiTrendingUp className="text-blue-500" size={24} />
                          <h3 className="text-gray-600 font-medium">Inventory Value</h3>
                        </div>
                        <p className="text-3xl font-extrabold text-blue-600">${totalValue.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PRODUCTS TAB */}
                {activeTab === 'products' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-text">My Products</h2>
                      <button onClick={() => setActiveTab('add')} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600">
                        + Add New
                      </button>
                    </div>
                    
                    {loading ? (
                      <p className="text-center py-10">Loading products...</p>
                    ) : products.length === 0 ? (
                      <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <FiBox size={40} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">You haven't listed any products yet.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="py-3 px-4 font-bold text-sm text-gray-600">Product</th>
                              <th className="py-3 px-4 font-bold text-sm text-gray-600">Price</th>
                              <th className="py-3 px-4 font-bold text-sm text-gray-600">Stock</th>
                              <th className="py-3 px-4 font-bold text-sm text-gray-600 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((p) => (
                              <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 flex items-center gap-3">
                                  <img src={p.images[0] || 'https://via.placeholder.com/50'} alt="product" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                                  <span className="font-medium text-sm text-gray-800 line-clamp-1">{p.title}</span>
                                </td>
                                <td className="py-3 px-4 text-sm">${p.price.toFixed(2)}</td>
                                <td className="py-3 px-4 text-sm">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right space-x-3">
                                  <button className="text-blue-500 hover:text-blue-700"><FiEdit2 size={16} /></button>
                                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700"><FiTrash2 size={16} /></button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* ADD PRODUCT TAB */}
                {activeTab === 'add' && (
                  <div>
                    <h2 className="text-xl font-bold text-text mb-6">List a New Product</h2>
                    <form onSubmit={handleCreateProduct} className="space-y-6">
                      
                      {/* Image Upload Zone */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Product Images</label>
                        <div className="flex gap-4 flex-wrap mb-4">
                          {formData.images.map((img, idx) => (
                            <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group">
                              <img src={img} alt="preview" className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <FiTrash2 size={20} />
                              </button>
                            </div>
                          ))}
                          <label className="w-24 h-24 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-primary transition-colors text-gray-500">
                            {uploading ? <span className="text-xs">Uploading...</span> : (
                              <>
                                <FiUploadCloud size={24} className="mb-1" />
                                <span className="text-xs font-medium">Add Image</span>
                              </>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Product Title</label>
                          <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                          <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50">
                            <option value="Handmade Crafts">Handmade Crafts</option>
                            <option value="Premium Fashion">Premium Fashion</option>
                            <option value="Eco-Friendly">Eco-Friendly</option>
                            <option value="Tech Accessories">Tech Accessories</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                          <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Stock Quantity</label>
                          <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <textarea rows="4" name="description" value={formData.description} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50"></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">The Story Behind the Product (Optional)</label>
                        <textarea rows="3" name="productStory" value={formData.productStory} onChange={handleInputChange} placeholder="Tell buyers how it's made..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50"></textarea>
                      </div>

                      <button type="submit" disabled={loading} className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/30 transition-all hover:bg-emerald-600 disabled:opacity-50">
                        {loading ? 'Publishing...' : 'Publish Product'}
                      </button>
                    </form>
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

export default SellerDashboard;
