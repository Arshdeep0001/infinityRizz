import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext'; // Import useCart hook

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(''); // State to manage the currently displayed main image
  const [showDescription, setShowDescription] = useState(false); // New state for toggling description visibility

  const { addToCart } = useCart(); // Get addToCart function from CartContext
  const { currency } = useCurrency();

  // Hardcoded sizes for example. In a real app, these might come from product data or be fetched.
  const availableSizes = ['S', 'M', 'L', 'XL'];

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://infinityrizz-1.onrender.com/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        // Set the first image from the 'images' array as the initial main image
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0]);
        } else {
          setMainImage('https://via.placeholder.com/800x600.png?text=No+Image'); // Fallback
        }

        // Set a default size if available, or fall back to the first in availableSizes
        if (data.sizes && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0]);
        } else if (availableSizes.length > 0) {
            setSelectedSize(availableSizes[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product details:", err);
        setError("Failed to load product details. Please try again later.");
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.countInStock === 0 || quantity === 0 || !selectedSize) {
      console.warn("Cannot add to cart: Product not available, quantity is zero, or size not selected.");
      return;
    }
    addToCart(product, quantity, selectedSize); // Call addToCart from context
    console.log(`Added ${quantity} of ${product.name} (Size: ${selectedSize}) to cart!`);
  };

  // --- Loading, Error, and Product Not Found States ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
        {/* <Navbar /> */}
        <div className="flex-grow flex justify-center items-center text-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mr-4"></div>
          Loading product details...
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
        {/* <Navbar /> */}
        <div className="flex-grow flex justify-center items-center text-red-500 text-xl">
          Error: {error}
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
        {/* <Navbar /> */}
        <div className="flex-grow flex justify-center items-center text-gray-400 text-xl">
          Product not found.
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white luxury-font">
      {/* <Navbar /> */}
      <main className="flex-grow py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto bg-black shadow-xl p-6 lg:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Product Images Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            {/* Main Image */}
            <div className="w-full h-96 sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden shadow-lg mb-4">
              <img
                src={mainImage} // Use mainImage state
                alt={product.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 ease-in-out"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 justify-center">
                {product.images.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl || 'https://via.placeholder.com/100x75.png?text=Thumb'}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className={`w-24 h-20 object-cover rounded-md cursor-pointer border-2
                                ${mainImage === imgUrl ? 'border-orange-400' : 'border-transparent hover:border-gray-600'}
                                transition-all duration-200`}
                    onClick={() => setMainImage(imgUrl)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-orange-400 text-4xl sm:text-5xl font-bold mb-6">
                {currency.symbol}{product.price ? (product.price * currency.rate).toFixed(2) : 'N/A'}
                <span className="ml-2 text-lg text-gray-400">{currency.code}</span>
              </p>
              <p className="text-gray-300 text-lg mb-6">
                Status:
                <span className={`ml-2 px-3 py-1 rounded-full font-semibold ${product.countInStock > 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
                {product.countInStock > 0 && (
                  <span className="ml-2 text-gray-400">({product.countInStock} available)</span>
                )}
              </p>
            </div>

            {/* Product Options & Add to Cart */}
            <div className="mt-auto pt-6 border-t border-gray-700">
              {product.countInStock > 0 && (
                <>
                  {/* Size Selection (using buttons for better UX) */}
                  <div className="mb-6">
                    <label htmlFor="size-select" className="block text-xl font-semibold mb-3 text-gray-200">
                      Select Size:
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-5 py-2 rounded-lg font-medium border-2
                            ${selectedSize === size
                              ? 'bg-white border-black text-black shadow-md'
                              : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
                            }
                            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <label htmlFor="quantity-select" className="block text-xl font-semibold mb-3 text-gray-200">
                      Quantity:
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        disabled={quantity <= 1}
                      >
                        {/* Minus icon */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                      </button>
                      <span className="text-2xl font-bold px-4">{quantity}</span>
                      <button
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        disabled={quantity >= product.countInStock}
                      >
                        {/* Plus icon */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-white text-black text-xl font-bold py-4 shadow-lg
                               hover:bg-orange-500 transition-colors duration-300
                               focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    disabled={!selectedSize || quantity === 0 || quantity > product.countInStock} // Disable if no size, zero quantity, or over stock
                  >
                    Add to Cart
                  </button>
                </>
              )}
              {/* Out of Stock Button */}
              {product.countInStock === 0 && (
                <button
                  className="w-full bg-gray-700 text-gray-400 text-xl font-bold py-4 rounded-lg cursor-not-allowed"
                  disabled
                >
                  Out of Stock
                </button>
              )}
            </div>
            {/* Product Description (Toggleable Section) */}
            <div className="mt-8 pt-6 border-t border-gray-700">
                <button
                    className="flex justify-between items-center w-full text-2xl font-bold text-white mb-3 focus:outline-none"
                    onClick={() => setShowDescription(!showDescription)}
                >
                    <span>Product Details</span>
                    <svg
                        className={`w-6 h-6 transform transition-transform duration-300 ${showDescription ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                {showDescription && (
                    <div className="transition-all duration-300 ease-in-out overflow-hidden">
                        <p className="text-gray-400 text-lg leading-relaxed">
                            {product.description || "A detailed description of this amazing product, highlighting its features, benefits, and specifications. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                        </p>
                    </div>
                )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;