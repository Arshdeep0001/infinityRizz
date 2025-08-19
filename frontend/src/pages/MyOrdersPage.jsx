// src/pages/MyOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import Navbar from '../components/Navbar'; // Assuming Navbar is globally rendered
import Footer from '../components/Footer'; // Assuming Footer is globally rendered
import { useAuth } from '../context/AuthContext';
import API from '../utils/api'; // Assuming API utility for fetching orders

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/myorders');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch logged-in user's orders from your backend
        const { data } = await API.get('/orders/myorders');
        // Sort orders by createdAt in descending order (newest first)
        const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } catch (err) {
        console.error("Failed to fetch my orders:", err);
        const message = err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
        {/* <Navbar /> */}
        <div className="flex-grow flex justify-center items-center text-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mr-4"></div>
          Loading your orders...
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
        <div className="max-w-5xl mx-auto bg-black border shadow-xl p-6 lg:p-10">
          <h2 className="text-4xl font-extrabold text-center mb-10 text-white">My Orders</h2>

          {orders.length === 0 ? (
            <div className="text-center text-gray-400 text-xl py-10">
              You haven't placed any orders yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800  overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">ID</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">DATE</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">TOTAL</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">PAID</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">DELIVERED</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200">
                      <td className="py-4 px-4 text-gray-200 text-sm">{order._id}</td>
                      <td className="py-4 px-4 text-gray-200 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-orange-400 font-bold text-sm">${order.totalPrice.toFixed(2)}</td>
                      <td className="py-4 px-4 text-sm">
                        {order.isPaid ? (
                          <span className="text-green-500">Paid</span>
                        ) : (
                          <span className="text-red-500">Not Paid</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {order.isDelivered ? (
                          <span className="text-green-500">Delivered</span>
                        ) : (
                          <span className="text-red-500">Not Delivered</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link to={`/order/${order._id}`} className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors duration-200 text-sm">
                          Details
                        </Link>
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

export default MyOrdersPage;
