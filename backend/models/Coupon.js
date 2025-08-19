// backend/models/Coupon.js
const mongoose = require('mongoose');

const couponSchema = mongoose.Schema(
  {
    code: { // The actual coupon code (e.g., "SAVE10", "FREESHIP")
      type: String,
      required: true,
      unique: true,
      uppercase: true, // Store codes in uppercase for consistency
    },
    discountType: { // 'percentage' or 'fixed'
      type: String,
      required: true,
      enum: ['percentage', 'fixed'], // Only allow these two types
    },
    discountValue: { // The value of the discount (e.g., 10 for 10%, or 5 for $5 fixed)
      type: Number,
      required: true,
      min: 0,
    },
    minimumPurchase: { // Optional: minimum order total required to use the coupon
      type: Number,
      default: 0,
      min: 0,
    },
    maxUses: { // Optional: total number of times this coupon can be used across all users
      type: Number,
      default: 0, // 0 means unlimited uses
      min: 0,
    },
    currentUses: { // Tracks how many times the coupon has been used
      type: Number,
      default: 0,
      min: 0,
    },
    expiresAt: { // Optional: date and time when the coupon becomes invalid
      type: Date,
      default: null, // Null means no expiry
    },
    isActive: { // Whether the coupon is currently active and usable
      type: Boolean,
      default: true,
    },
    // Optional: Array of user IDs who have already used this coupon (for per-user limits)
    // This can be complex for large scale, but simple for single-use per user
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Method to check if a coupon is valid
couponSchema.methods.isValid = function (orderTotal, userId) {
  if (!this.isActive) {
    return { valid: false, message: 'Coupon is inactive.' };
  }
  if (this.expiresAt && new Date() > this.expiresAt) {
    return { valid: false, message: 'Coupon has expired.' };
  }
  if (this.maxUses > 0 && this.currentUses >= this.maxUses) {
    return { valid: false, message: 'Coupon has reached its maximum usage limit.' };
  }
  if (this.minimumPurchase > 0 && orderTotal < this.minimumPurchase) {
    return { valid: false, message: `Minimum purchase of $${this.minimumPurchase.toFixed(2)} required.` };
  }
  // If you implement per-user usage limits, check here:
  // if (this.usedBy.includes(userId)) {
  //   return { valid: false, message: 'You have already used this coupon.' };
  // }
  return { valid: true, message: 'Coupon is valid.' };
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function (amount) {
  if (this.discountType === 'percentage') {
    return amount * (this.discountValue / 100);
  } else if (this.discountType === 'fixed') {
    return this.discountValue;
  }
  return 0;
};


const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
