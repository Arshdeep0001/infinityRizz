// src/pages/PlaceOrderPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import API, { applyCoupon } from '../utils/api';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { currency } = useCurrency();

  // --- MODIFICATION: Move shipping address state here from ShippingPage ---
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  // --- END MODIFICATION ---

  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const itemsPrice = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = 0.15 * itemsPrice;

  let finalTotalPrice = itemsPrice + shippingPrice + taxPrice;
  let discountAmount = 0;

  if (appliedCoupon && appliedCoupon.discountAmount) {
    discountAmount = appliedCoupon.discountAmount;
    finalTotalPrice = Math.max(0, finalTotalPrice - discountAmount);
  }

  useEffect(() => {
    // Redirect if not authenticated or cart is empty
    if (!isAuthenticated) {
      navigate('/login?redirect=/placeorder');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }

    // --- MODIFICATION: Load shipping address and payment method from local storage on component mount ---
    try {
        const savedShippingAddress = localStorage.getItem('shippingAddress');
        const savedPaymentMethod = localStorage.getItem('paymentMethod');

        if (savedShippingAddress) {
            const parsedAddress = JSON.parse(savedShippingAddress);
            setAddress(parsedAddress.address || '');
            setCity(parsedAddress.city || '');
            setPostalCode(parsedAddress.postalCode || '');
            setCountry(parsedAddress.country || '');
        }
        if (savedPaymentMethod) {
          setPaymentMethod(savedPaymentMethod);
        }

        const savedAppliedCoupon = sessionStorage.getItem('appliedCoupon');
        if (savedAppliedCoupon) {
          setAppliedCoupon(JSON.parse(savedAppliedCoupon));
        }

    } catch (e) {
      console.error("Failed to load checkout details from localStorage", e);
      setErrorMessage("Error loading checkout details. Please restart the process.");
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
      sessionStorage.removeItem('appliedCoupon');
      navigate('/cart');
    }
  }, [isAuthenticated, cartItems, navigate]);


  const handleApplyCoupon = async () => {
    setCouponLoading(true);
    setCouponError('');
    setAppliedCoupon(null);
    setErrorMessage('');

    if (!couponCode) {
      setCouponError('Please enter a coupon code.');
      setCouponLoading(false);
      return;
    }

    const orderItemsForCoupon = cartItems.map(item => ({
      price: item.price,
      qty: item.quantity
    }));

    try {
      const { data } = await applyCoupon(couponCode, orderItemsForCoupon);
      setAppliedCoupon(data.coupon);
      sessionStorage.setItem('appliedCoupon', JSON.stringify(data.coupon));
      setCouponError('');
    } catch (error) {
      console.error("Error applying coupon:", error);
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      setCouponError(message);
      setAppliedCoupon(null);
      sessionStorage.removeItem('appliedCoupon');
    } finally {
      setCouponLoading(false);
    }
  };


  const placeOrderHandler = async (e) => {
    e.preventDefault(); // Prevent form submission default
    setLoading(true);
    setErrorMessage('');
    setOrderSuccess(null);

    // --- MODIFICATION: Check for address fields directly from state ---
    if (!address || !city || !postalCode || !country || !paymentMethod || cartItems.length === 0) {
        setErrorMessage("Please fill in all shipping and payment details.");
        setLoading(false);
        return;
    }

    // Save shipping and payment method to local storage before placing order
    const shippingAddress = { address, city, postalCode, country };
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    localStorage.setItem('paymentMethod', paymentMethod);
    // --- END MODIFICATION ---

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          qty: item.quantity,
          image: (item.images && item.images.length > 0 && item.images[0].trim() !== '')
                 ? item.images[0]
                 : 'https://placehold.co/60x60/EEE/31343C?text=No+Image',
          price: item.price,
          selectedSize: item.selectedSize,
        })),
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        itemsPrice: parseFloat(itemsPrice.toFixed(2)),
        shippingPrice: parseFloat(shippingPrice.toFixed(2)),
        taxPrice: parseFloat(taxPrice.toFixed(2)),
        totalPrice: parseFloat(finalTotalPrice.toFixed(2)),
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
      };

      console.log("Order Data being sent:", orderData);
      const { data } = await API.post('/orders', orderData);

      setOrderSuccess(data);
      clearCart();
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
      sessionStorage.removeItem('appliedCoupon');

      navigate(`/order/${data._id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // --- MODIFICATION: No loading state for missing shipping/payment anymore. User will see the form. ---
  if (!isAuthenticated || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
        <div className="flex-grow flex justify-center items-center text-gray-400 text-xl">
          Please log in and add items to your cart.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white luxury-font">
      <main className="flex-grow py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto bg-black border shadow-xl p-6 lg:p-10">
          <h2 className="text-4xl font-extrabold text-center mb-10 text-white">Place Order</h2>

          {errorMessage && (
            <div className="bg-red-800 text-white p-3 rounded-md mb-4 text-center">
              {errorMessage}
            </div>
          )}
          {loading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
              Placing Order...
            </div>
          )}
          {orderSuccess && (
            <div className="bg-green-800 text-white p-3 rounded-md mb-4 text-center">
              Order Placed Successfully! Order ID: {orderSuccess._id}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <h3 className="text-3xl font-bold mb-6 text-white border-b border-gray-700 pb-4">Order Items</h3>
              {cartItems.length === 0 ? (
                <div className="text-gray-400">Your cart is empty.</div>
              ) : (
                <ul className="space-y-4">
                  {cartItems.map((item) => (
                    <li key={`${item._id}-${item.selectedSize}`} className="flex items-center bg-gray-900 p-3 shadow-sm">
                      <img
                        src={(item.images && item.images.length > 0) ? item.images[0] : 'https://via.placeholder.com/60x60.png?text=Item'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md mr-3"
                      />
                      <div className="flex-grow">
                        <Link to={`/product/${item._id}`} className="text-lg font-semibold text-white hover:text-orange-400 transition-colors">
                          {item.name}
                        </Link>
                        {item.selectedSize && (
                          <p className="text-gray-400 text-sm">Size: {item.selectedSize}</p>
                        )}
                        <p className="text-gray-300">
                          {item.quantity} x {currency.symbol}{item.price ? (item.price * currency.rate).toFixed(2) : '0.00'} = {currency.symbol}{(item.quantity * (item.price || 0) * currency.rate).toFixed(2)}
                          <span className="ml-1 text-xs text-gray-400">{currency.code}</span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* --- MODIFICATION: Shipping & Payment form moved here --- */}
              <div className="mt-8">
                <h3 className="text-3xl font-bold mb-6 text-white border-b border-gray-700 pb-4">Shipping & Payment</h3>
                <form onSubmit={placeOrderHandler}>
                    <h4 className="text-xl font-bold mt-8 mb-4 text-white">Shipping Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label htmlFor="address" className="block text-gray-300 text-lg font-semibold mb-2 luxury-font">
                                Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                className="w-full p-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 luxury-font"
                                placeholder="Enter address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="city" className="block text-gray-300 text-lg font-semibold mb-2 luxury-font">
                                City
                            </label>
                            <input
                                type="text"
                                id="city"
                                className="w-full p-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 luxury-font"
                                placeholder="Enter city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="postalCode" className="block text-gray-300 text-lg font-semibold mb-2 luxury-font">
                                Postal Code
                            </label>
                            <input
                                type="text"
                                id="postalCode"
                                className="w-full p-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 luxury-font"
                                placeholder="Enter postal code"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="country" className="block text-gray-300 text-lg font-semibold mb-2 luxury-font">
                                Country
                            </label>
                            <input
                                type="text"
                                id="country"
                                className="w-full p-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 luxury-font"
                                placeholder="Enter country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <h4 className="text-xl font-bold mt-8 mb-4 text-white">Payment Method</h4>
                    <div className="mb-6">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="cashOnDelivery"
                                name="paymentMethod"
                                value="Cash on Delivery"
                                checked={paymentMethod === 'Cash on Delivery'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label htmlFor="cashOnDelivery" className="ml-3 block text-gray-300 text-lg luxury-font">
                                Cash on Delivery
                            </label>
                        </div>
                    </div>
                </form>
              </div>
              {/* --- END MODIFICATION --- */}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 bg-gray-900 p-6 shadow-md border border-gray-700">
              <h3 className="text-3xl font-bold mb-6 text-white border-b border-gray-700 pb-4">Order Summary</h3>
              <div className="space-y-3 text-lg">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="font-semibold">{currency.symbol}{(itemsPrice * currency.rate).toFixed(2)} <span className="ml-1 text-xs text-gray-400">{currency.code}</span></span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold">{currency.symbol}{(shippingPrice * currency.rate).toFixed(2)} <span className="ml-1 text-xs text-gray-400">{currency.code}</span></span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-semibold">{currency.symbol}{(taxPrice * currency.rate).toFixed(2)} <span className="ml-1 text-xs text-gray-400">{currency.code}</span></span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <label htmlFor="couponCode" className="block text-gray-300 text-lg font-semibold mb-2">
                    Have a coupon?
                  </label>
                  <div className="flex gap items-center">
                    <input
                      type="text"
                      id="couponCode"
                      className="flex-grow px-1 p-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponLoading}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-orange-500 text-white py-2 px-4 hover:bg-orange-600 transition-colors duration-200 flex-shrink-0"
                      disabled={couponLoading}
                    >
                      {couponLoading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-400 text-sm mt-2">{couponError}</p>
                  )}
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-400 mt-2">
                      <span>Discount ({appliedCoupon.code}):</span>
                      <span className="font-semibold">-{currency.symbol}{(appliedCoupon.discountAmount * currency.rate).toFixed(2)} <span className="ml-1 text-xs text-gray-400">{currency.code}</span></span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-2xl font-bold border-t border-gray-600 pt-3 mt-3">
                  <span>Total:</span>
                  <span className="text-orange-400">{currency.symbol}{(finalTotalPrice * currency.rate).toFixed(2)} <span className="ml-1 text-lg text-gray-400">{currency.code}</span></span>
                </div>
              </div>

              {/* --- MODIFICATION: Place Order button is no longer a separate form but part of the main page logic --- */}
              <button
                onClick={placeOrderHandler}
                className="w-full bg-white text-black text-xl font-bold py-4 shadow-lg mt-8
                           hover:bg-orange-500 transition-colors duration-300
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                disabled={loading || cartItems.length === 0 || !address || !city || !postalCode || !country || !paymentMethod}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
              {/* --- END MODIFICATION --- */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlaceOrderPage;
