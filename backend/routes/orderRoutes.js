// =========================================================
// routes/orderRoutes.js - Order API Routes (Updated with Status Updates)
// Added PUT routes to mark orders as paid and delivered.
// =========================================================
const express = require('express');
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order'); // Import the Order model
const Product = require('../models/Product'); // Import Product model to update stock
const { protect, admin } = require('../middleware/authMiddleware'); // Import protect and admin middleware

const router = express.Router(); // Create an Express router

// =============================================
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// =============================================
router.post(
    '/',
    protect, // Only logged-in users can create orders
    asyncHandler(async (req, res) => {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        // Basic validation: Check if orderItems exist and are not empty
        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        } else {
            // Create a new order instance
            const order = new Order({
                user: req.user._id, // User ID comes from the 'protect' middleware
                orderItems,
                shippingAddress,
                paymentMethod,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            // Save the order to the database
            const createdOrder = await order.save();

            // Update Product Stock (CRITICAL STEP)
            for (const item of orderItems) {
                const product = await Product.findById(item.product);
                if (product) {
                    // Decrease stock count
                    product.countInStock -= item.qty;
                    await product.save();
                } else {
                    console.error(`Product with ID ${item.product} not found during stock update.`);
                }
            }

            res.status(201).json(createdOrder); // 201 Created
        }
    })
);

// =============================================
// @desc    Get logged in user's orders (for 'My Orders' screen)
// @route   GET /api/orders/myorders
// @access  Private
// =============================================
router.get(
    '/myorders',
    protect,
    asyncHandler(async (req, res) => {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    })
);

// =============================================
// @desc    Get ALL orders (for Admin Order List screen)
// @route   GET /api/orders
// @access  Private/Admin
// =============================================
router.get(
    '/', // This route will now handle GET requests to /api/orders
    protect, // Must be logged in
    admin,   // Must be an admin
    asyncHandler(async (req, res) => {
        // Find all orders and populate the 'user' field to get user name and email
        const orders = await Order.find({}).populate('user', 'name email');
        res.json(orders);
    })
);

// =============================================
// @desc    Get order by ID (for future 'Order Details' screen)
// @route   GET /api/orders/:id
// @access  Private
// =============================================
router.get(
    '/:id',
    protect,
    asyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id).populate(
            'user',
            'name email'
        );

        if (order) {
            if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
                res.json(order);
            } else {
                res.status(401);
                throw new Error('Not authorized to view this order');
            }
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    })
);

// =============================================
// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin (or user with payment gateway callback)
// =============================================
router.put(
    '/:id/pay',
    protect,
    admin, // For now, only admin can mark as paid. Later, this could be triggered by payment gateway.
    asyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            // In a real app, paymentResult would come from the payment gateway
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    })
);

// =============================================
// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
// =============================================
router.put(
    '/:id/deliver',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    })
);

module.exports = router;
