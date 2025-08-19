// =========================================================
// server.js - Main Express Server File (Updated)
// Integrate the new order routes into your main server file.
// =========================================================
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes'); // Correct: Import coupon routes

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
    res.send('API is running...');
});

// =============================================
// API Routes
// Mount all API routes
// =============================================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes); // <-- THIS WAS MISSING! Now correctly mounted.

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
