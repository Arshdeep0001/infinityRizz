// =========================================================
// models/Order.js - Order Data Model with Mongoose (Updated for Image)
// This file defines the schema for an Order in your database.
// =========================================================
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Reference to the User who placed the order
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                // Updated: Ensure this matches what frontend sends (a single string)
                image: {
                    type: String,
                    required: true, // Frontend sends a placeholder if no image
                },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product', // Reference to the actual Product
                },
                selectedSize: { // Ensure selectedSize is also stored with order items
                    type: String,
                    required: false, // Size might not be applicable to all products
                },
            },
        ],
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        paymentResult: {
            // This object will hold details from the payment gateway (e.g., PayPal, Stripe)
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false, // Initially, order is not paid
        },
        paidAt: {
            type: Date, // Timestamp when payment was made
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false, // Initially, order is not delivered
        },
        deliveredAt: {
            type: Date, // Timestamp when order was delivered
        },
        // Added coupon fields to the Order model
        couponCode: {
            type: String,
            required: false,
        },
        discountAmount: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; // Export the Order model
