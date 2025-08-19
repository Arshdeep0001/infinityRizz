// src/pages/AdminProductListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar'; // Assuming Navbar is globally rendered
// import Footer from '../components/Footer'; // Assuming Footer is globally rendered
import { useAuth } from '../context/AuthContext';
import { getAllProducts, deleteProduct } from '../utils/api'; // Import new API calls

const AdminProductListPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null); // To disable delete button during operation

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products for admin:", err);
      const message = err.response && err.response.data.message
        ? err.response.data.message
        : err.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isAuthenticated || (user && !user.isAdmin)) {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [isAuthenticated, user, navigate]);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setDeletingProductId(productId);
      try {
        await deleteProduct(productId);
        // Remove product from local state
        setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert(`Error deleting product: ${err.response?.data?.message || err.message}`);
      } finally {
        setDeletingProductId(null);
      }
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
        {/* <Navbar /> */}
        <div className="flex-grow flex justify-center items-center text-red-500 text-xl">
          You are not authorized to view this page.
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
        {/* <Navbar /> */}
        <div className="flex-grow flex justify-center items-center text-2xl">
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
        <div className="flex-grow flex justify-center items-center text-red-500 text-xl">
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
        <div className="max-w-7xl mx-auto bg-gray-900 rounded-lg shadow-xl p-6 lg:p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-white">Products (Admin)</h2>
            <Link
              to="/admin/product/create"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
            >
              Add Product
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center text-gray-400 text-xl py-10">
              No products found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">ID</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">NAME</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">PRICE</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">CATEGORY</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">BRAND</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">STOCK</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200">
                      <td className="py-4 px-4 text-gray-200 text-sm">{product._id}</td>
                      <td className="py-4 px-4 text-gray-200 text-sm">{product.name}</td>
                      <td className="py-4 px-4 text-orange-400 font-bold text-sm">${product.price.toFixed(2)}</td>
                      <td className="py-4 px-4 text-gray-200 text-sm">{product.category}</td>
                      <td className="py-4 px-4 text-gray-200 text-sm">{product.brand}</td>
                      <td className="py-4 px-4 text-gray-200 text-sm">{product.countInStock}</td>
                      <td className="py-4 px-4 text-right flex flex-col sm:flex-row gap-2 justify-end">
                        <Link to={`/admin/product/${product._id}/edit`} className="bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 transition-colors duration-200 text-sm">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                          disabled={deletingProductId === product._id}
                        >
                          {deletingProductId === product._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default AdminProductListPage;
