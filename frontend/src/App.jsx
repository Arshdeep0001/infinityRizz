// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Import your pages
import LandingPage from './pages/LandingPage';
import ShopPage from './pages/ShopPage';
import ProductDetail from './pages/ProductDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import PlaceholderPage from './pages/PlaceholderPage';
import AdminOrderListPage from './pages/AdminOrderListPage';
import AdminProductListPage from './pages/AdminProductListPage';
import AdminProductEditPage from './pages/AdminProductEditPage';
import AdminCouponListPage from './pages/AdminCouponListPage'; // New: Import AdminCouponListPage
import AdminCouponEditPage from './pages/AdminCouponEditPage'; // New: Import AdminCouponEditPage
import ForgotPasswordPage from './pages/ForgotPasswordPage'; // New: Import the ForgotPasswordPage

// Import Navbar (rendered globally)
import Navbar from './components/Navbar';
// Import the AdminProtectedRoute
import AdminProtectedRoute from './components/AdminProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          {/* Navbar is rendered globally here, outside of Routes */}
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* New: Add the ForgotPasswordPage route */}
            <Route path="/cart" element={<CartPage />} />
            {/* --- MODIFICATION: The shipping route is no longer needed in this new flow --- */}
            {/* <Route path="/shipping" element={<ShippingPage />} /> */}
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/placeorder" element={<PlaceOrderPage />} />
            <Route path="/order/:id" element={<OrderDetailsPage />} />
            <Route path="/myorders" element={<MyOrdersPage />} />
            <Route path="/placeholder" element={<PlaceholderPage />} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<AdminProtectedRoute />}>
              {/* Nested routes will only be accessible if AdminProtectedRoute allows */}
              <Route path="orders" element={<AdminOrderListPage />} />
              <Route path="products" element={<AdminProductListPage />} />
              <Route path="product/create" element={<AdminProductEditPage />} />
              <Route path="product/:id/edit" element={<AdminProductEditPage />} />
              <Route path="coupons" element={<AdminCouponListPage />} /> {/* New: Admin Coupon List */}
              <Route path="coupon/create" element={<AdminCouponEditPage />} /> {/* New: Admin Create Coupon */}
              <Route path="coupon/:id/edit" element={<AdminCouponEditPage />} /> {/* New: Admin Edit Coupon */}
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
