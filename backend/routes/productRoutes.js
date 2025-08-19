// =========================================================
// routes/productRoutes.js - Product API Routes (Updated for Multiple Images)
// =========================================================
const express = require('express');
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product'); // Import the Product model
const { protect, admin } = require('../middleware/authMiddleware'); // Import middleware

const router = express.Router(); // Create an Express router

// =============================================
// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
// =============================================
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const products = await Product.find({}); // Find all products
        res.json(products); // Send products as JSON response
    })
);

// =============================================
// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
// =============================================
router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id); // Find product by ID from URL params

        if (product) {
            res.json(product); // Send product as JSON response
        } else {
            res.status(404); // Not Found
            throw new Error('Product not found');
        }
    })
);

// =============================================
// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
// =============================================
router.post(
    '/',
    protect, // Only authenticated users can access
    admin,   // Only administrators can access
    asyncHandler(async (req, res) => {
        const {
            name,
            price,
            description,
            // Changed 'image' to 'images'
            images, // Expecting an array of image URLs
            brand,
            category,
            countInStock,
        } = req.body;

        if (!description || description.trim() === '') {
            res.status(400);
            throw new Error('Description is required and cannot be empty.');
        }

        // Validate images: ensure it's an array and has at least one image if required
        if (!Array.isArray(images) || images.length === 0) {
            res.status(400);
            throw new Error('At least one image URL is required for the product.');
        }

        const product = new Product({
            name,
            price,
            user: req.user._id,
            images, // Use the array of images
            brand,
            category,
            countInStock,
            description,
            numReviews: 0,
            rating: 0,
            reviews: []
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    })
);

// =============================================
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
// =============================================
router.put(
    '/:id',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const {
            name,
            price,
            description,
            // Changed 'image' to 'images'
            images, // Expecting an array of image URLs
            brand,
            category,
            countInStock,
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price !== undefined ? price : product.price;
            product.description = description || product.description;
            // Update images field
            if (Array.isArray(images) && images.length > 0) {
                product.images = images;
            } else if (images !== undefined && images.length === 0) {
                // Allow clearing images if an empty array is explicitly sent
                product.images = [];
            }
            product.brand = brand || product.brand;
            product.category = category || product.category;
            product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    })
);

// =============================================
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
// =============================================
router.delete(
    '/:id',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    })
);

module.exports = router;
