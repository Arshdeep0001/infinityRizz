// =========================================================
// middleware/authMiddleware.js - Authentication Middleware
// This file contains middleware functions to protect routes.
// It verifies JWTs and checks user roles (e.g., admin).
// =========================================================
const jwt = require('jsonwebtoken');         // For verifying JWTs
const asyncHandler = require('express-async-handler'); // For handling async errors
const User = require('../models/User');      // Import the User model

// Middleware to protect routes (ensure user is logged in)
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if the Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (remove 'Bearer ' prefix)
            token = req.headers.authorization.split(' ')[1];

            // Verify token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by ID from the decoded token payload
            // .select('-password') excludes the password field from the returned user object
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Proceed to the next middleware/route handler
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(401); // Unauthorized
            throw new Error('Not authorized, token failed');
        }
    }

    // If no token is found in the header
    if (!token) {
        res.status(401); // Unauthorized
        throw new Error('Not authorized, no token');
    }
});

// Middleware to check if the user is an admin
const admin = (req, res, next) => {
    // Check if req.user exists (from the 'protect' middleware) and if isAdmin is true
    if (req.user && req.user.isAdmin) {
        next(); // User is an admin, proceed
    } else {
        res.status(401); // Unauthorized
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { protect, admin }; // Export both middleware functions
