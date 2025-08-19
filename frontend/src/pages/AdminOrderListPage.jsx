// src/pages/AdminOrderListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import Navbar from '../components/Navbar'; // Assuming Navbar is globally rendered
import Footer from '../components/Footer'; // Assuming Footer is globally rendered
import { useAuth } from '../context/AuthContext';
import { getAllOrders, updateOrderToPaid, updateOrderToDelivered } from '../utils/api';

const AdminOrderListPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isAuthenticated || (user && !user.isAdmin)) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await getAllOrders();
        // Sort orders by createdAt in descending order (newest first)
        const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } catch (err) {
        console.error("Failed to fetch all orders:", err);
        const message = err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  const handleMarkAsPaid = async (orderId) => {
    setUpdatingOrderId(orderId);
    try {
      const paymentResult = {
        id: `ADMIN_PAY_${Date.now()}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: 'admin@example.com',
      };
      await updateOrderToPaid(orderId, paymentResult);
      // Update the order in the local state and re-sort to keep newest on top
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order =>
          order._id === orderId ? { ...order, isPaid: true, paidAt: new Date().toISOString() } : order
        );
        return updatedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });
    } catch (err) {
      console.error("Failed to mark order as paid:", err);
      alert(`Error marking order as paid: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderToDelivered(orderId);
      // Update the order in the local state and re-sort
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order =>
          order._id === orderId ? { ...order, isDelivered: true, deliveredAt: new Date().toISOString() } : order
        );
        return updatedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });
    } catch (err) {
      console.error("Failed to mark order as delivered:", err);
      alert(`Error marking order as delivered: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdatingOrderId(null);
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
          Loading all orders...
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
          <h2 className="text-4xl font-extrabold text-center mb-10 text-white">All Orders (Admin)</h2>

          {orders.length === 0 ? (
            <div className="text-center text-gray-400 text-xl py-10">
              No orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">ID</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">USER</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">DATE</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">TOTAL</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">PAID</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">DELIVERED</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200">
                      <td className="py-4 px-4 text-gray-200 text-sm">{order._id}</td>
                      <td className="py-4 px-4 text-gray-200 text-sm">
                        {order.user ? order.user.name : 'N/A'}
                      </td>
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
                      <td className="py-4 px-4 text-right flex flex-col sm:flex-row gap-2 justify-end">
                        <Link to={`/order/${order._id}`} className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                          Details
                        </Link>
                        {!order.isPaid && (
                          <button
                            onClick={() => handleMarkAsPaid(order._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                            disabled={updatingOrderId === order._id || !order.user}
                          >
                            {updatingOrderId === order._id ? 'Marking...' : 'Mark Paid'}
                          </button>
                        )}
                        {!order.isDelivered && (
                          <button
                            onClick={() => handleMarkAsDelivered(order._id)}
                            className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm"
                            disabled={updatingOrderId === order._id || !order.user}
                          >
                            {updatingOrderId === order._id ? 'Marking...' : 'Mark Delivered'}
                          </button>
                        )}
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

export default AdminOrderListPage;
