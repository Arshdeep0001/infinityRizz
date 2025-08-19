import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import PlanetSelection from '../components/PlanetSelection';
import { getAllProducts } from '../utils/api';
import { Link } from 'react-router-dom';
import ScrollProgressIndicator from '../components/ScrollProgressIndicator'; // Import the new component

// New FeaturedProductCard component - adapted from ProductList's ProductCard
const FeaturedProductCard = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(
    (product.images && product.images.length > 0) ? product.images[0] : 'https://via.placeholder.com/400x300.png?text=Product+Image'
  );

  const handleMouseEnter = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImage(product.images[1]);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImage((product.images && product.images.length > 0) ? product.images[0] : 'https://via.placeholder.com/400x300.png?text=Product+Image');
  };

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div
        className="bg-black border border-gray-700 shadow-xl overflow-hidden
                   transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer group
                   flex flex-col luxury-font h-full"
      >
        <div
          className="w-full h-96 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-white mb-2 leading-tight hover:text-orange-400 transition-colors duration-200">
              {product.name}
            </h3>
            <p className="text-s text-white mb-4">${product.price ? product.price.toFixed(2) : 'N/A'}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};


const LandingPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await getAllProducts();
        // Sort products by creation date in descending order (latest first)
        const sortedProducts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        // Take the first 4 products
        setFeaturedProducts(sortedProducts.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
        const message = err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white luxury-font">
      {/* <Navbar /> */}
      <main className="flex-grow">
        <HeroSection />

        {/* Featured Products Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16">
          <div className="container mx-auto">
            <h2 className="text-4xl font-extrabold text-center mb-12 tracking-tight">Latest Drops</h2>

            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mr-4"></div>
                Loading featured products...
              </div>
            ) : error ? (
              <div className="text-center text-red-500 text-xl py-10">
                Error loading featured products: {error}
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="text-center text-gray-400 text-xl py-10">
                No featured products available.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
                  <FeaturedProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        <PlanetSelection />
      </main>
      <Footer />
      <ScrollProgressIndicator /> {/* Add the component here */}
    </div>
  );
};

export default LandingPage;