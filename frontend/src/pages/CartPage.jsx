// src/pages/CartPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { currency } = useCurrency();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, selectedSize, newQuantity, countInStock) => {
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > countInStock) newQuantity = countInStock;
    updateQuantity(productId, selectedSize, newQuantity);
  };

  const handleCheckout = () => {
    // --- MODIFICATION: Navigate directly to the place order page ---
    navigate('/placeorder');
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white luxury-font">
      {/* <Navbar /> */}
      <main className="flex-grow py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto black border shadow-xl p-6 lg:p-10">
          <h2 className="text-4xl font-extrabold text-center mb-10 text-white">Your Shopping Cart</h2>

          {cartItems.length === 0 ? (
            <div className="text-center text-gray-400 text-xl py-10">
              Your cart is empty. <Link to="/shop" className="text-orange-400 hover:underline">Go shopping!</Link>
            </div>
          ) : (
            <>
              <div className="space-y-6 mb-8">
                {cartItems.map((item) => (
                  <div
                    key={`${item._id}-${item.selectedSize}`}
                    className="flex flex-col sm:flex-row items-center bg-gray-900 p-4 shadow-md border border-gray-700"
                  >
                    <Link to={`/product/${item._id}`} className="flex-shrink-0 mr-4">
                      <img
                        src={(item.images && item.images.length > 0) ? item.images[0] : 'https://via.placeholder.com/100x100.png?text=Product'}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    </Link>
                    <div className="flex-grow text-center sm:text-left mt-4 sm:mt-0">
                      <Link to={`/product/${item._id}`}>
                        <h3 className="text-xl font-semibold text-white hover:text-orange-400 transition-colors duration-200">
                          {item.name}
                        </h3>
                      </Link>
                      {item.selectedSize && (
                        <p className="text-gray-400 text-sm mt-1">Size: {item.selectedSize}</p>
                      )}
                      <p className="text-orange-400 text-lg font-bold mt-2">
                        {currency.symbol}{(item.price * currency.rate).toFixed(2)}
                        <span className="ml-1 text-xs text-gray-400">{currency.code}</span>
                      </p>
                    </div>

                    <div className="flex items-center mt-4 sm:mt-0 sm:ml-auto">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.selectedSize, item.quantity - 1, item.countInStock)}
                        className="bg-gray-700 text-white p-2 rounded-l-lg hover:bg-gray-600 transition-colors duration-200"
                        disabled={item.quantity <= 1}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                      </button>
                      <span className="bg-gray-700 text-white px-4 py-2 text-lg font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.selectedSize, item.quantity + 1, item.countInStock)}
                        className="bg-gray-700 text-white p-2 rounded-r-lg hover:bg-gray-600 transition-colors duration-200"
                        disabled={item.quantity >= item.countInStock}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id, item.selectedSize)}
                      className="ml-4 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors duration-200 mt-4 sm:mt-0"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 pt-6 mt-6">
                <h3 className="text-2xl font-bold text-white">Total:</h3>
                <span className="text-3xl font-bold text-orange-400">
                  {currency.symbol}{(totalPrice * currency.rate).toFixed(2)}
                  <span className="ml-1 text-lg text-gray-400">{currency.code}</span>
                </span>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleCheckout}
                  className="flex-1 bg-white text-black text-xl font-bold py-4 shadow-lg
                             hover:bg-orange-500 transition-colors duration-300
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="flex-1 bg-gray-700 text-white text-xl font-bold py-4 shadow-lg
                             hover:bg-gray-600 transition-colors duration-300
                             focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
