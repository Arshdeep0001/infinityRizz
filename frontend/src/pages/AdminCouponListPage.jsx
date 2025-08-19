// src/pages/AdminCouponListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'; // Assuming Footer is globally rendered
import { useAuth } from '../context/AuthContext';
import { getAllCoupons, deleteCoupon } from '../utils/api'; // Import new API calls

const AdminCouponListPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingCouponId, setDeletingCouponId] = useState(null); // To disable delete button during operation

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getAllCoupons();
      // Sort coupons by creation date, newest first
      const sortedCoupons = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setCoupons(sortedCoupons);
    } catch (err) {
      console.error("Failed to fetch coupons for admin:", err);
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
    fetchCoupons();
  }, [isAuthenticated, user, navigate]);

  const handleDelete = async (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setDeletingCouponId(couponId);
      try {
        await deleteCoupon(couponId);
        // Remove coupon from local state
        setCoupons(prevCoupons => prevCoupons.filter(c => c._id !== couponId));
      } catch (err) {
        console.error("Failed to delete coupon:", err);
        alert(`Error deleting coupon: ${err.response?.data?.message || err.message}`);
      } finally {
        setDeletingCouponId(null);
      }
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
        <div className="flex-grow flex justify-center items-center text-red-500 text-xl">
          You are not authorized to view this page.
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
        <div className="flex-grow flex justify-center items-center text-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mr-4"></div>
          Loading coupons...
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
        <div className="flex-grow flex justify-center items-center text-red-500 text-xl">
          Error: {error}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white luxury-font">
      <main className="flex-grow py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto bg-gray-900 rounded-lg shadow-xl p-6 lg:p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-white">Coupons (Admin)</h2>
            <Link
              to="/admin/coupon/create"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
            >
              Add Coupon
            </Link>
          </div>

          {coupons.length === 0 ? (
            <div className="text-center text-gray-400 text-xl py-10">
              No coupons found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">ID</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">CODE</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">TYPE</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">VALUE</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">MIN. PURCHASE</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">USES</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">EXPIRES</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">ACTIVE</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200">
                      <td className="py-4 px-4 text-gray-200 text-sm">{coupon._id}</td>
                      <td className="py-4 px-4 text-orange-400 font-bold text-sm">{coupon.code}</td>
                      <td className="py-4 px-4 text-gray-200 text-sm">{coupon.discountType}</td>
                      <td className="py-4 px-4 text-gray-200 text-sm">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue.toFixed(2)}`}
                      </td>
                      <td className="py-4 px-4 text-gray-200 text-sm">${coupon.minimumPurchase.toFixed(2)}</td>
                      <td className="py-4 px-4 text-gray-200 text-sm">
                        {coupon.maxUses === 0 ? 'Unlimited' : `${coupon.currentUses}/${coupon.maxUses}`}
                      </td>
                      <td className="py-4 px-4 text-gray-200 text-sm">
                        {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {coupon.isActive ? (
                          <span className="text-green-500">Yes</span>
                        ) : (
                          <span className="text-red-500">No</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right flex flex-col sm:flex-row gap-2 justify-end">
                        <Link to={`/admin/coupon/${coupon._id}/edit`} className="bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 transition-colors duration-200 text-sm">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                          disabled={deletingCouponId === coupon._id}
                        >
                          {deletingCouponId === coupon._id ? 'Deleting...' : 'Delete'}
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
      <Footer />
    </div>
  );
};

export default AdminCouponListPage;
