// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems } = useCart();

  const [paymentMethod, setPaymentMethod] = useState(() => {
    const savedPaymentMethod = localStorage.getItem('paymentMethod');
    return savedPaymentMethod ? savedPaymentMethod : 'PayPal';
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/payment');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }
    const shippingAddress = localStorage.getItem('shippingAddress');
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [isAuthenticated, cartItems, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!paymentMethod) {
      setErrorMessage('Please select a payment method.');
      return;
    }

    localStorage.setItem('paymentMethod', paymentMethod);

    navigate('/placeorder'); // <--- Changed navigation target to /placeorder
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* <Navbar /> */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="bg-black p-8 shadow-xl w-full max-w-md border border-gray-700">
          <h2 className="text-4xl font-extrabold text-center mb-8 text-white luxury-font">Payment Method</h2>
          {errorMessage && (
            <div className="bg-red-800 text-white p-3 rounded-md mb-4 text-center">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-300 text-lg font-semibold mb-3 luxury-font">
                Select Method:
              </label>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="PayPal"
                    checked={paymentMethod === 'PayPal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="paypal" className="ml-3 text-gray-200 luxury-font">
                    PayPal or Credit Card
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="stripe"
                    name="paymentMethod"
                    value="Stripe"
                    checked={paymentMethod === 'Stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="stripe" className="ml-3 text-gray-200 luxury-font">
                    Stripe (Placeholder)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cashOnDelivery"
                    name="paymentMethod"
                    value="CashOnDelivery"
                    checked={paymentMethod === 'CashOnDelivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="cashOnDelivery" className="ml-3 text-gray-200 luxury-font">
                    Cash On Delivery
                  </label>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3 hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 luxury-font"
            >
              Continue to Place Order
            </button>
          </form>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default PaymentPage;
