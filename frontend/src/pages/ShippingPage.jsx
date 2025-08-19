// src/pages/ShippingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ShippingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems } = useCart();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/shipping');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }

    try {
      const savedShippingAddress = localStorage.getItem('shippingAddress');
      if (savedShippingAddress) {
        const parsedAddress = JSON.parse(savedShippingAddress);
        setAddress(parsedAddress.address || '');
        setCity(parsedAddress.city || '');
        setPostalCode(parsedAddress.postalCode || '');
        setCountry(parsedAddress.country || '');
      }
    } catch (e) {
      console.error("Failed to parse shipping address from localStorage", e);
      localStorage.removeItem('shippingAddress');
    }
  }, [isAuthenticated, cartItems, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!address || !city || !postalCode || !country) {
      setErrorMessage('Please fill in all shipping fields.');
      return;
    }

    const shippingAddress = { address, city, postalCode, country };
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));

    navigate('/payment'); // <--- Changed navigation target to /payment
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* <Navbar /> */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="bg-black-900 p-8  shadow-xl w-full max-w-md border border-gray-700">
          <h2 className="text-4xl font-extrabold text-center mb-8 text-white luxury-font">Shipping Address</h2>
          {errorMessage && (
            <div className="bg-red-800 text-white p-3 rounded-md mb-4 text-center">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="address" className="block text-gray-300 text-lg font-semibold mb-2 luxury-font">
                Address
              </label>
              <input
                type="text"
                id="address"
                className="w-full p-3  bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 luxury-font"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="city" className="block text-gray-300 text-lg font-semibold mb-2 luxury-font">
                City
              </label>
              <input
                type="text"
                id="city"
                className="w-full p-3 bg-gray-900  border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 luxury-font"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="postalCode" className="block text-gray-300 text-lg font-semibold mb-2 luxury-font">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                className="w-full p-3 bg-gray-900  border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 luxury-font"
                placeholder="Enter postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="country" className="block text-gray-300 text-lg font-semibold mb-2 luxury-font">
                Country
              </label>
              <input
                type="text"
                id="country"
                className="w-full p-3 bg-gray-900  border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 luxury-font"
                placeholder="Enter country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3 hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 luxury-font"
            >
              Continue to Payment
            </button>
          </form>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default ShippingPage;
