// =========================================================
// models/User.js - User Data Model with Mongoose
// This file defines the schema for a User in your database
// and includes pre-save middleware for password hashing.
// =========================================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        // --- START MODIFICATION: Use mobileNumber instead of email ---
        mobileNumber: {
            type: String,
            required: true,
            unique: true,
        },
        // --- END MODIFICATION ---
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        // --- START MODIFICATION: Add fields for OTP verification ---
        otp: {
            type: String,
            required: false,
        },
        otpExpiration: {
            type: Date,
            required: false,
        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false,
        },
        // --- END MODIFICATION ---
    },
    {
        timestamps: true,
    }
);

// =============================================
// Mongoose Middleware (Pre-Save Hook)
// =============================================
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

// =============================================
// Mongoose Method for Password Comparison
// =============================================
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
