// =========================================================
// models/Product.js - Product Data Model with Mongoose
// This file defines the schema for a Product in your database.
// =========================================================
const mongoose = require('mongoose'); // Import Mongoose

// Define the Review Schema (nested within Product Schema)
const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId, // Link to the User who wrote the review
            required: true,
            ref: 'User', // Reference the 'User' model
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt for reviews
    }
);

// Define the Product Schema
const productSchema = mongoose.Schema(
    {
        // Link to the User who created/added this product (e.g., admin)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Reference the 'User' model
        },
        name: {
            type: String,
            required: true,
        },
        // Changed 'image' to 'images' as an array of strings
        images: {
            type: [String], // Array of strings for image URLs
            required: true, // Still required, meaning the array itself must exist (can be empty [])
            // REMOVED: default: ['https://placehold.co/600x400/EEE/31343C?text=No+Image'],
        },
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        reviews: [reviewSchema], // Array of reviewSchema objects
        rating: {
            type: Number,
            required: true,
            default: 0, // Default rating is 0
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0, // Default number of reviews is 0
        },
        price: {
            type: Number,
            required: true,
            default: 0, // Default price is 0
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0, // Default stock is 0
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt for products
    }
);

// Create the Product model from the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product; // Export the Product model
