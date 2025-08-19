// src/pages/OrderDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api'; // Assuming API utility for fetching orders

const OrderDetailsPage = () => {
  const { id: orderId } = useParams(); // Get order ID from URL
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // To check authentication and user role

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/order/${orderId}`);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch order by ID from your backend
        const { data } = await API.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        const message = err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
        {/* <Navbar /> */}
        <div className="flex-grow flex justify-center items-center text-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mr-4"></div>
          Loading order details...
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

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
        {/* <Navbar /> */}
        <div className="flex-grow flex justify-center items-center text-gray-400 text-xl">
          Order not found.
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white luxury-font">
      {/* <Navbar /> */}
      <main className="flex-grow py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto bg-black border  shadow-xl p-6 lg:p-10">
          <h2 className="text-4xl font-extrabold text-center mb-10 text-white">Order: {order._id}</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Info */}
            <div className="lg:col-span-1 bg-gray-900 p-6  shadow-md border border-gray-700">
              <h3 className="text-2xl font-bold mb-4 text-white border-b border-gray-700 pb-3">Shipping</h3>
              <p className="text-gray-300 mb-2">
                <strong>Name:</strong> {order.user.name}
              </p>
              <p className="text-gray-300 mb-2">
                <strong>Email:</strong> <a href={`mailto:${order.user.email}`} className="text-blue-400 hover:underline">{order.user.email}</a>
              </p>
              <p className="text-gray-300 mb-2">
                <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              <p className="text-gray-300">
                <strong>Delivered:</strong>{' '}
                {order.isDelivered ? (
                  <span className="text-green-500">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</span>
                ) : (
                  <span className="text-red-500">Not Delivered</span>
                )}
              </p>
            </div>

            {/* Payment Info */}
            <div className="lg:col-span-1 bg-gray-900 p-6  shadow-md border border-gray-700">
              <h3 className="text-2xl font-bold mb-4 text-white border-b border-gray-700 pb-3">Payment Method</h3>
              <p className="text-gray-300 mb-2">
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              <p className="text-gray-300">
                <strong>Paid:</strong>{' '}
                {order.isPaid ? (
                  <span className="text-green-500">Paid on {new Date(order.paidAt).toLocaleDateString()}</span>
                ) : (
                  <span className="text-red-500">Not Paid</span>
                )}
              </p>
              {/* You can display paymentResult details here if available and needed */}
            </div>

            {/* Order Summary & Items */}
            <div className="lg:col-span-1 bg-gray-900 p-6  shadow-md border border-gray-700">
              <h3 className="text-2xl font-bold mb-4 text-white border-b border-gray-700 pb-3">Order Summary</h3>
              <div className="space-y-3 text-lg mb-6">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="font-semibold">${order.itemsPrice ? order.itemsPrice.toFixed(2) : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold">${order.shippingPrice ? order.shippingPrice.toFixed(2) : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-semibold">${order.taxPrice ? order.taxPrice.toFixed(2) : 'N/A'}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold border-t border-gray-600 pt-3 mt-3">
                  <span>Total:</span>
                  <span className="text-orange-400">${order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A'}</span>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-4 text-white border-b border-gray-700 pb-3">Order Items</h3>
              {order.orderItems.length === 0 ? (
                <div className="text-gray-400">Order is empty.</div>
              ) : (
                <ul className="space-y-3">
                  {order.orderItems.map((item, index) => (
                    <li key={item.product + index} className="flex items-center">
                      <img
                        src={item.image || 'https://via.placeholder.com/50x50.png?text=Item'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md mr-3"
                      />
                      <div className="flex-grow">
                        <Link to={`/product/${item.product}`} className="text-lg font-semibold text-white hover:text-orange-400 transition-colors">
                          {item.name}
                        </Link>
                        {item.selectedSize && (
                          <p className="text-gray-400 text-sm">Size: {item.selectedSize}</p>
                        )}
                        <p className="text-gray-300">
                          {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default OrderDetailsPage;
