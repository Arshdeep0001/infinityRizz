// src/pages/AdminProductEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Assuming Navbar is globally rendered
import Footer from '../components/Footer'; // Assuming Footer is globally rendered
import { useAuth } from '../context/AuthContext';
import { getProductById, createProduct, updateProduct } from '../utils/api';

const AdminProductEditPage = () => {
  const { id: productId } = useParams(); // Get product ID from URL if editing
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  // Changed from 'image' to 'images' as an array of strings
  const [images, setImages] = useState(['', '']); // State to hold two image URLs
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const isEditMode = Boolean(productId); // Determine if in edit mode

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isAuthenticated || (user && !user.isAdmin)) {
      navigate('/login');
      return;
    }

    if (isEditMode) {
      const fetchProduct = async () => {
        setLoading(true);
        setError(null);
        try {
          const { data } = await getProductById(productId);
          setName(data.name);
          setPrice(data.price);
          // Set images array, ensuring it has at least two elements for the inputs
          // If data.images is null/undefined or empty, default to ['', '']
          // Otherwise, take existing images and pad with empty strings up to 2
          setImages(data.images && data.images.length > 0 ? [...data.images, '', ''].slice(0, 2) : ['', '']);
          setBrand(data.brand);
          setCategory(data.category);
          setCountInStock(data.countInStock);
          setDescription(data.description);
        } catch (err) {
          console.error("Failed to fetch product for edit:", err);
          const message = err.response && err.response.data.message
            ? err.response.data.message
            : err.message;
          setError(message);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId, isEditMode, isAuthenticated, user, navigate]);

  // Handler for image URL changes
  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    // Filter out empty image URLs before sending to backend
    // This ensures only valid URLs are sent.
    const filteredImages = images.filter(url => url.trim() !== '');

    // If no valid images are provided, the backend model's default will apply.
    // Frontend should still enforce at least one image if 'required' is set on input.
    if (filteredImages.length === 0) {
      setError('At least one image URL is required.');
      setLoading(false);
      return;
    }

    const productData = {
      name,
      price,
      images: filteredImages, // Send only the filtered, non-empty image URLs
      brand,
      category,
      countInStock,
      description,
    };

    try {
      if (isEditMode) {
        await updateProduct(productId, productData);
        setSuccessMessage('Product updated successfully!');
      } else {
        await createProduct(productData);
        setSuccessMessage('Product created successfully!');
        // Clear form after creation
        setName('');
        setPrice(0);
        setImages(['', '']); // Reset image inputs to empty
        setBrand('');
        setCategory('');
        setCountInStock(0);
        setDescription('');
      }
      // Optionally navigate back to product list after success
      // navigate('/admin/products');
    } catch (err) {
      console.error("Failed to save product:", err);
      const message = err.response && err.response.data.message
        ? err.response.data.message
        : err.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
        {/* <Navbar /> */}
        <div className="flex-grow flex justify-center items-center text-red-500 text-xl">
          You are not authorized to view this page.
        </div>
        <Footer />
      </div>
    );
  }

  if (loading && isEditMode) { // Only show loading spinner if editing and fetching data
    return (
      <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
        {/* <Navbar /> */}
        <div className="flex-grow flex justify-center items-center text-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mr-4"></div>
          Loading product data...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white luxury-font">
      {/* <Navbar /> */}
      <main className="flex-grow py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg shadow-xl p-6 lg:p-10">
          <h2 className="text-4xl font-extrabold text-center mb-8 text-white">
            {isEditMode ? 'Edit Product' : 'Create Product'}
          </h2>

          {error && (
            <div className="bg-red-800 text-white p-3 rounded-md mb-4 text-center">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-800 text-white p-3 rounded-md mb-4 text-center">
              {successMessage}
            </div>
          )}
          {loading && !isEditMode && ( // Show loading for create mode submission
             <div className="flex justify-center items-center py-4">
               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
               Saving Product...
             </div>
           )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-300 text-lg font-semibold mb-2">Name</label>
              <input type="text" id="name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="mb-6">
              <label htmlFor="price" className="block text-gray-300 text-lg font-semibold mb-2">Price</label>
              <input type="number" id="price" className="form-input" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required min="0" step="0.01" />
            </div>
            {/* Image URL Inputs - now for multiple images */}
            <div className="mb-6">
              <label className="block text-gray-300 text-lg font-semibold mb-2">Image URLs</label>
              <p className="text-gray-500 text-sm mb-2">Enter at least one image URL. You can add a second one.</p>
              <input
                type="text"
                id="image1"
                className="form-input mb-3"
                placeholder="Enter Image URL 1"
                value={images[0]}
                onChange={(e) => handleImageChange(0, e.target.value)}
                required // First image is required
              />
              <input
                type="text"
                id="image2"
                className="form-input"
                placeholder="Enter Image URL 2 (Optional)"
                value={images[1]}
                onChange={(e) => handleImageChange(1, e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="brand" className="block text-gray-300 text-lg font-semibold mb-2">Brand</label>
              <input type="text" id="brand" className="form-input" value={brand} onChange={(e) => setBrand(e.target.value)} required />
            </div>
            <div className="mb-6">
              <label htmlFor="category" className="block text-gray-300 text-lg font-semibold mb-2">Category</label>
              <input type="text" id="category" className="form-input" value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>
            <div className="mb-6">
              <label htmlFor="countInStock" className="block text-gray-300 text-lg font-semibold mb-2">Count In Stock</label>
              <input type="number" id="countInStock" className="form-input" value={countInStock} onChange={(e) => setCountInStock(parseInt(e.target.value))} required min="0" />
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-300 text-lg font-semibold mb-2">Description</label>
              <textarea id="description" className="form-input h-32" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              disabled={loading}
            >
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product')}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminProductEditPage;
