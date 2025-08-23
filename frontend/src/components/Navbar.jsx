// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import InfinityRizzLogo from '../assets/infinity-rizz-logo1.png'; // Make sure this path is correct!

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const { currency, changeCurrency, currencyOptions } = useCurrency();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black text-white p-5 sticky top-0 z-50 shadow-md luxury-font">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <div className="flex-shrink-0"> {/* Added a div to control image size */}
          <Link to="/" onClick={closeMobileMenu}>
            <img src={InfinityRizzLogo} alt="InfinityRizz Logo" className="h-3 w-auto" /> {/* Adjust h-10 as needed for your logo size */}
          </Link>
        </div>
        {/* Country/Currency Dropdown */}
        <div className="mr-4">
          <select
            value={currency.code}
            onChange={e => changeCurrency(e.target.value)}
            className="bg-black text-white border border-gray-600 p-2 rounded luxury-font"
            aria-label="Select Country/Currency"
          >
            {currencyOptions.map(opt => (
              <option key={opt.code} value={opt.code}>
                {opt.country} ({opt.symbol})
              </option>
            ))}
          </select>
        </div>
        

        {/* Hamburger Menu Button (visible on small screens) */}
        <div className="md:hidden flex items-center">
          {/* Cart icon always visible on mobile */}
          <Link to="/cart" className="relative hover:text-gray-300 mr-4" onClick={closeMobileMenu}>
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Menu (visible on medium and larger screens) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/shop" className="hover:text-gray-300">Shop</Link>

          {/* Admin Dropdown (for Products, Orders, and Coupons) */}
          {isAuthenticated && user && user.isAdmin && (
            <div className="relative group">
              <button className="hover:text-gray-300 text-blue-400 font-semibold focus:outline-none">
                Admin <span className="ml-1">&#9662;</span> {/* Down arrow */}
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out transform scale-95 group-hover:scale-100 origin-top">
                <Link to="/admin/orders" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700" onClick={closeMobileMenu}>Orders</Link>
                <Link to="/admin/products" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700" onClick={closeMobileMenu}>Products</Link>
                <Link to="/admin/coupons" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700" onClick={closeMobileMenu}>Coupons</Link> {/* New Admin Coupon Link */}
                {/* Add more admin links here */}
              </div>
            </div>
          )}

          {isAuthenticated ? (
            <>
              <Link to="/myorders" className="hover:text-gray-300">My Orders</Link>
              <span className="text-gray-300 hidden md:inline">Welcome, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="bg-transparent border text-white px-3 py-1 hover:bg-white hover:text-black transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
          {/* Cart icon for desktop */}
          <Link to="/cart" className="relative hover:text-gray-300 ml-4">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Content (toggles visibility) */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-black shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center py-4 space-y-4">
          <Link to="/" className="hover:text-gray-300 text-lg py-2" onClick={closeMobileMenu}>Home</Link>
          <Link to="/shop" className="hover:text-gray-300 text-lg py-2" onClick={closeMobileMenu}>Shop</Link>

          {/* Admin Links in Mobile Menu */}
          {isAuthenticated && user && user.isAdmin && (
            <>
              <span className="text-blue-400 font-semibold text-lg py-2">Admin Panel</span>
              <Link to="/admin/orders" className="hover:text-gray-300 text-lg py-2 pl-4 w-full text-center" onClick={closeMobileMenu}>Orders</Link>
              <Link to="/admin/products" className="hover:text-gray-300 text-lg py-2 pl-4 w-full text-center" onClick={closeMobileMenu}>Products</Link>
              <Link to="/admin/coupons" className="hover:text-gray-300 text-lg py-2 pl-4 w-full text-center" onClick={closeMobileMenu}>Coupons</Link> {/* New Admin Coupon Link for Mobile */}
              {/* Add more admin links here for mobile */}
            </>
          )}

          {isAuthenticated && (
            <Link to="/myorders" className="hover:text-gray-300 text-lg py-2" onClick={closeMobileMenu}>My Orders</Link>
          )}

          {isAuthenticated ? (
            <>
              <span className="text-gray-300 text-lg py-2">Welcome, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="bg-transparent border text-white px-3 py-1 hover:bg-white hover:text-black transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300 text-lg py-2" onClick={closeMobileMenu}>Login</Link>
              <Link to="/register" className="hover:text-gray-300 text-lg py-2" onClick={closeMobileMenu}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;