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

// CORS configuration for both local and deployed frontends
const allowedOrigins = [
    'http://localhost:5173',
    'https://kl1c886l-5173.inc1.devtunnels.ms/', // deployed frontend (adjust if needed)
    'https://your-frontend-domain.com' // add your actual deployed frontend domain if different
];
const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

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
