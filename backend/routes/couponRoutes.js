// backend/routes/couponRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon'); // Import the Coupon model
const { protect, admin } = require('../middleware/authMiddleware'); // Import auth middleware
const Product = require('../models/Product'); // Assuming Product model might be needed for order total calculation

const router = express.Router();

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
router.post(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { code, discountType, discountValue, minimumPurchase, maxUses, expiresAt, isActive } = req.body;

    // Basic validation
    if (!code || !discountType || discountValue === undefined) {
      res.status(400);
      throw new Error('Please enter all required fields: code, discount type, and discount value.');
    }

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      res.status(400);
      throw new Error('Coupon with this code already exists.');
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minimumPurchase: minimumPurchase || 0,
      maxUses: maxUses || 0,
      expiresAt: expiresAt || null, // Ensure it's null if not provided
      isActive: isActive !== undefined ? isActive : true,
    });

    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  })
);

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
router.get(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({});
    res.json(coupons);
  })
);

// @desc    Get coupon by ID
// @route   GET /api/coupons/:id
// @access  Private/Admin
router.get(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      res.json(coupon);
    } else {
      res.status(404);
      throw new Error('Coupon not found');
    }
  })
);

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { code, discountType, discountValue, minimumPurchase, maxUses, expiresAt, isActive } = req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      coupon.code = code ? code.toUpperCase() : coupon.code;
      coupon.discountType = discountType || coupon.discountType;
      coupon.discountValue = discountValue !== undefined ? discountValue : coupon.discountValue;
      coupon.minimumPurchase = minimumPurchase !== undefined ? minimumPurchase : coupon.minimumPurchase;
      coupon.maxUses = maxUses !== undefined ? maxUses : coupon.maxUses;
      coupon.expiresAt = expiresAt !== undefined ? expiresAt : coupon.expiresAt;
      coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;

      const updatedCoupon = await coupon.save();
      res.json(updatedCoupon);
    } else {
      res.status(404);
      throw new Error('Coupon not found');
    }
  })
);

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
router.delete(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      await coupon.deleteOne();
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404);
      throw new Error('Coupon not found');
    }
  })
);

// @desc    Apply a coupon (validate and calculate discount)
// @route   POST /api/coupons/apply
// @access  Public (or Private if you want to track user-specific usage)
router.post(
  '/apply',
  // You might want to protect this route if you implement usedBy array check
  // protect,
  asyncHandler(async (req, res) => {
    const { couponCode, orderItems } = req.body; // orderItems needed to calculate total
    const userId = req.user ? req.user._id : null; // Get user ID if protected

    if (!couponCode || !orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      res.status(400);
      throw new Error('Invalid request. Coupon code and order items are required.');
    }

    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

    if (!coupon) {
      res.status(404);
      throw new Error('Coupon not found.');
    }

    // Calculate current order total from provided orderItems
    // This assumes orderItems in the request have 'price' and 'qty'
    const orderTotal = orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

    const validationResult = coupon.isValid(orderTotal, userId);

    if (!validationResult.valid) {
      res.status(400);
      throw new Error(validationResult.message);
    }

    const discountAmount = coupon.calculateDiscount(orderTotal);

    res.json({
      valid: true,
      message: validationResult.message,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: parseFloat(discountAmount.toFixed(2)), // Ensure precision
      },
    });
  })
);


module.exports = router;
