import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, clearCartState } from '../redux/slices/cartSlice';
import api from '../services/api';
import { FiCheckCircle, FiShield, FiCreditCard, FiX } from 'react-icons/fi';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [address, setAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const items = cart?.items || [];
  const itemsPrice = items.reduce((acc, item) => acc + (item.product?.price * item.quantity), 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.postalCode || !address.country) {
      setErrorMsg('Please fill in all address fields');
      return;
    }
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      // Formulate order items
      const orderItems = items.map(i => ({
        name: i.product.title,
        qty: i.quantity,
        image: i.product.images[0],
        price: i.product.price,
        product: i.product._id,
        seller: i.product.seller._id
      }));

      // 1. Create Order & get Razorpay Order ID
      const { data: orderData } = await api.post('/orders', {
        orderItems,
        shippingAddress: { address: address.street, city: address.city, postalCode: address.postalCode, country: address.country },
        paymentMethod: 'Razorpay',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      });

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.keyId || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder', 
        amount: orderData.razorpayOrder.amount,
        currency: orderData.razorpayOrder.currency,
        name: "TrustKart",
        description: "Secure Premium Checkout",
        image: "https://your-logo-url.png",
        order_id: orderData.razorpayOrder.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment Signature Backend
            const { data: verifyData } = await api.post(`/orders/${orderData.order._id}/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyData.message === 'Payment verified successfully') {
              dispatch(clearCartState());
              navigate('/order-success');
            }
          } catch (err) {
            setErrorMsg('Payment verification failed.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#10b981" // Emerald primary color
        },
        modal: {
          ondismiss: function() {
            setErrorMsg('Payment cancelled by user. Please try again.');
            setIsProcessing(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        setErrorMsg('Payment Failed: ' + response.error.description);
        setIsProcessing(false);
      });
      rzp1.open();

    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message);
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="text-center py-20 mt-20">Loading cart...</div>;
  if (items.length === 0 && !isProcessing) {
    return (
      <div className="text-center py-32 mt-20">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="text-primary hover:underline">Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-text mb-8">Secure Checkout</h1>
        
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3">
            <div className="mt-0.5"><FiX size={20} /></div>
            <div>
              <p className="font-bold">Payment Error</p>
              <p className="text-sm">{errorMsg}</p>
              <p className="text-sm mt-1">Please try your payment again or use a different method (UPI, Card, etc).</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left: Shipping Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-text mb-6 border-b border-gray-100 pb-4">Shipping Information</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input type="text" name="street" value={address.street} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" name="city" value={address.city} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input type="text" name="postalCode" value={address.postalCode} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input type="text" name="country" value={address.country} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50" />
                </div>
              </form>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between text-gray-500 text-sm">
               <div className="flex items-center gap-2">
                 <FiShield size={20} className="text-primary" />
                 Secure 256-bit SSL Encryption
               </div>
               <div className="flex items-center gap-2">
                 <FiCreditCard size={20} className="text-primary" />
                 Powered by Razorpay
               </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold text-text mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <img src={item.product?.images[0]} alt={item.product?.title} className="w-16 h-16 object-cover rounded-lg bg-gray-50 border border-gray-100" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-text line-clamp-1">{item.product?.title}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-text mt-1">${(item.product?.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6 border-t border-gray-100 pt-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">${shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-medium">${taxPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8 border-t border-gray-100 pt-6">
                <span className="text-lg font-bold text-text">Total</span>
                <span className="text-2xl font-extrabold text-primary">${totalPrice.toFixed(2)}</span>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 text-center">
                <p className="text-sm font-bold text-gray-700 mb-2">Accepted Payment Methods</p>
                <div className="flex justify-center gap-3 text-gray-500">
                  <span className="bg-white px-2 py-1 rounded shadow-sm border text-xs font-bold text-blue-600">UPI / QR</span>
                  <span className="bg-white px-2 py-1 rounded shadow-sm border text-xs font-medium">Credit/Debit Cards</span>
                  <span className="bg-white px-2 py-1 rounded shadow-sm border text-xs font-medium">NetBanking</span>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex justify-center items-center gap-2 disabled:bg-gray-400 disabled:shadow-none"
              >
                {isProcessing ? 'Processing...' : errorMsg ? 'Retry Payment' : 'Pay Securely'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
