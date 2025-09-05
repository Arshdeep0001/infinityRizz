import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { useCurrency } from '../context/CurrencyContext';
// import Navbar from '../components/Navbar'; // Assuming Navbar is globally rendered
// import Footer from '../components/Footer'; // Assuming Footer is globally rendered

const ProductList = () => {
  const { currency } = useCurrency();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('https://infinityrizz-1.onrender.com/api/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((product) => {
    const productName = product.name ? product.name.toLowerCase() : '';
    const productCategory = product.category ? product.category.toLowerCase() : '';

    const matchesSearch = productName.includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filter !== 'all') {
      if (filter === 'price-low') {
        matchesFilter = product.price < 50;
      } else if (filter === 'price-high') {
        matchesFilter = product.price >= 50;
      } else {
        matchesFilter = productCategory === filter.toLowerCase();
      }
    }
    return matchesSearch && matchesFilter;
  });

  const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
        {/* <Navbar /> */}
        <div className="flex-grow flex justify-center items-center h-screen text-white text-2xl bg-black">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mr-4"></div>
          Loading products...
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
        {/* <Navbar /> */}
        <div className="flex-grow flex justify-center items-center h-screen text-red-500 text-xl bg-black">
          Error: {error}
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white luxury-font">
      {/* <Navbar /> */}
      <main className="flex-grow py-12 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-10 tracking-tight luxury-font">Our Products</h2>

          <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 w-full md:w-auto bg-black text-white border border-gray-600 p-3  placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out luxury-font"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="w-full md:w-auto bg-black text-white border border-gray-600 p-3  focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ease-in-out luxury-font"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all" >All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
              <option value="price-low">Price under $50</option>
              <option value="price-high">Price $50 and up</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-400 text-2xl mt-16 luxury-font">
              No products found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      {/* <Footer /> */}
    </div>
  );
};

// New ProductCard component to handle hover effect
const ProductCard = ({ product }) => {
  const { currency } = useCurrency();
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
        className="bg-black border border-gray-700  shadow-xl overflow-hidden
                   transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer group
                   flex flex-col luxury-font h-full"
      >
        <div
          // The height of the image container has been changed from h-96 to h-72
          className="w-full h-72 overflow-hidden"
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
            <p className="text-s text-white mb-4">
              {currency.symbol}
              {product.price ? (product.price * currency.rate).toFixed(2) : 'N/A'}
              <span className="ml-1 text-xs text-gray-400">{currency.code}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductList;
