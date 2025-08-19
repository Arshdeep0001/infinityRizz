// src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach the token
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- START MODIFICATION: Update auth-related API functions ---
// Export specific API functions
export const sendOtpForRegistration = (userData) => API.post('/auth/send-otp', userData);
export const verifyOtpForRegistration = (otpData) => API.post('/auth/verify-otp', otpData);
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const forgotPassword = (mobileNumberData) => API.post('/auth/forgot-password', mobileNumberData);
export const resetPassword = (resetData) => API.post('/auth/reset-password', resetData);
// --- END MODIFICATION ---

// Admin Order API Calls
export const getAllOrders = () => API.get('/orders');
export const updateOrderToPaid = (orderId, paymentResult) => API.put(`/orders/${orderId}/pay`, paymentResult);
export const updateOrderToDelivered = (orderId) => API.put(`/orders/${orderId}/deliver`);

// Admin Product API Calls
export const getAllProducts = () => API.get('/products');
export const getProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (productData) => API.post('/products', productData);
export const updateProduct = (id, productData) => API.put(`/products/${id}`, productData);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// --- New Admin Coupon API Calls ---
export const getAllCoupons = () => API.get('/coupons'); // GET /api/coupons (Admin only)
export const getCouponById = (id) => API.get(`/coupons/${id}`); // GET /api/coupons/:id (Admin only)
export const createCoupon = (couponData) => API.post('/coupons', couponData); // POST /api/coupons (Admin only)
export const updateCoupon = (id, couponData) => API.put(`/coupons/${id}`, couponData); // PUT /api/coupons/:id (Admin only)
export const deleteCoupon = (id) => API.delete(`/coupons/${id}`); // DELETE /api/coupons/:id (Admin only)
export const applyCoupon = (couponCode, orderItems) => API.post('/coupons/apply', { couponCode, orderItems }); // POST /api/coupons/apply (Public/Private)


export default API;
