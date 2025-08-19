// src/pages/AdminCouponEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'; // Assuming Footer is globally rendered
import { useAuth } from '../context/AuthContext';
import { getCouponById, createCoupon, updateCoupon } from '../utils/api';

const AdminCouponEditPage = () => {
  const { id: couponId } = useParams(); // Get coupon ID from URL if editing
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage'); // Default to percentage
  const [discountValue, setDiscountValue] = useState(0);
  const [minimumPurchase, setMinimumPurchase] = useState(0);
  const [maxUses, setMaxUses] = useState(0);
  const [expiresAt, setExpiresAt] = useState(''); // Date string for input
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const isEditMode = Boolean(couponId); // Determine if in edit mode

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isAuthenticated || (user && !user.isAdmin)) {
      navigate('/login');
      return;
    }

    if (isEditMode) {
      const fetchCoupon = async () => {
        setLoading(true);
        setError(null);
        try {
          const { data } = await getCouponById(couponId);
          setCode(data.code);
          setDiscountType(data.discountType);
          setDiscountValue(data.discountValue);
          setMinimumPurchase(data.minimumPurchase);
          setMaxUses(data.maxUses);
          // Format date for input type="date"
          setExpiresAt(data.expiresAt ? new Date(data.expiresAt).toISOString().split('T')[0] : '');
          setIsActive(data.isActive);
        } catch (err) {
          console.error("Failed to fetch coupon for edit:", err);
          const message = err.response && err.response.data.message
            ? err.response.data.message
            : err.message;
          setError(message);
        } finally {
          setLoading(false);
        }
      };
      fetchCoupon();
    }
  }, [couponId, isEditMode, isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    const couponData = {
      code,
      discountType,
      discountValue: parseFloat(discountValue), // Ensure number
      minimumPurchase: parseFloat(minimumPurchase), // Ensure number
      maxUses: parseInt(maxUses), // Ensure integer
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null, // Convert to ISO string or null
      isActive,
    };

    try {
      if (isEditMode) {
        await updateCoupon(couponId, couponData);
        setSuccessMessage('Coupon updated successfully!');
      } else {
        await createCoupon(couponData);
        setSuccessMessage('Coupon created successfully!');
        // Clear form after creation
        setCode('');
        setDiscountType('percentage');
        setDiscountValue(0);
        setMinimumPurchase(0);
        setMaxUses(0);
        setExpiresAt('');
        setIsActive(true);
      }
      // Optionally navigate back to coupon list after success
      // navigate('/admin/coupons');
    } catch (err) {
      console.error("Failed to save coupon:", err);
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
        <div className="flex-grow flex justify-center items-center text-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mr-4"></div>
          Loading coupon data...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white luxury-font">
      <main className="flex-grow py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg shadow-xl p-6 lg:p-10">
          <h2 className="text-4xl font-extrabold text-center mb-8 text-white">
            {isEditMode ? 'Edit Coupon' : 'Create Coupon'}
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
               Saving Coupon...
             </div>
           )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="code" className="block text-gray-300 text-lg font-semibold mb-2">Coupon Code</label>
              <input type="text" id="code" className="form-input" value={code} onChange={(e) => setCode(e.target.value)} required />
            </div>
            <div className="mb-6">
              <label htmlFor="discountType" className="block text-gray-300 text-lg font-semibold mb-2">Discount Type</label>
              <select id="discountType" className="form-input" value={discountType} onChange={(e) => setDiscountType(e.target.value)} required>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="discountValue" className="block text-gray-300 text-lg font-semibold mb-2">Discount Value</label>
              <input type="number" id="discountValue" className="form-input" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} required min="0" step="0.01" />
            </div>
            <div className="mb-6">
              <label htmlFor="minimumPurchase" className="block text-gray-300 text-lg font-semibold mb-2">Minimum Purchase</label>
              <input type="number" id="minimumPurchase" className="form-input" value={minimumPurchase} onChange={(e) => setMinimumPurchase(e.target.value)} min="0" step="0.01" />
            </div>
            <div className="mb-6">
              <label htmlFor="maxUses" className="block text-gray-300 text-lg font-semibold mb-2">Max Uses (0 for unlimited)</label>
              <input type="number" id="maxUses" className="form-input" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} min="0" step="1" />
            </div>
            <div className="mb-6">
              <label htmlFor="expiresAt" className="block text-gray-300 text-lg font-semibold mb-2">Expires At (Optional)</label>
              <input type="date" id="expiresAt" className="form-input" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
            </div>
            <div className="mb-6 flex items-center">
              <input type="checkbox" id="isActive" className="mr-2 h-5 w-5 text-blue-600 rounded" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <label htmlFor="isActive" className="text-gray-300 text-lg font-semibold">Is Active</label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              disabled={loading}
            >
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Coupon' : 'Create Coupon')}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminCouponEditPage;
