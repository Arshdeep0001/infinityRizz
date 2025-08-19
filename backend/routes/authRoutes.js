// =========================================================
// routes/authRoutes.js - User Authentication Routes
// This file contains the API endpoints for user registration, OTP verification, login, and password reset.
// =========================================================
const express = require('express');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// --- START MODIFICATION: Add Twilio and OTP related dependencies ---
const twilio = require('twilio');

// Helper Function: Generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper Function: Send OTP via Twilio
const sendOtp = async (mobileNumber, otp) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhoneNumber) {
        throw new Error('Twilio credentials not found in environment variables. Please check your .env file.');
    }

    const client = new twilio(accountSid, authToken);

    try {
        await client.messages.create({
            body: `Your verification code is: ${otp}`,
            from: twilioPhoneNumber,
            to: mobileNumber,
        });
        console.log(`OTP sent to ${mobileNumber}`);
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error('Failed to send OTP via Twilio');
    }
};
// --- END MODIFICATION ---

// =============================================
// Helper Function: Generate JWT
// =============================================
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// =============================================
// @desc    Send OTP for user registration
// @route   POST /api/auth/send-otp
// @access  Public
// =============================================
router.post(
    '/send-otp',
    asyncHandler(async (req, res) => {
        const { name, mobileNumber, password } = req.body;

        const userExists = await User.findOne({ mobileNumber });

        if (userExists) {
            res.status(400);
            throw new Error('User with this mobile number already exists');
        }

        const otp = generateOTP();
        const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        const user = await User.create({
            name,
            mobileNumber,
            password,
            otp,
            otpExpiration,
        });

        if (user) {
            await sendOtp(mobileNumber, otp);

            res.status(200).json({
                message: 'OTP sent successfully. Please verify your mobile number.',
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    })
);

// =============================================
// @desc    Verify OTP and register the user
// @route   POST /api/auth/verify-otp
// @access  Public
// =============================================
router.post(
    '/verify-otp',
    asyncHandler(async (req, res) => {
        const { mobileNumber, otp } = req.body;

        const user = await User.findOne({ mobileNumber });

        if (!user) {
            res.status(400);
            throw new Error('User not found');
        }

        if (user.otp === otp && user.otpExpiration > Date.now()) {
            user.otp = undefined;
            user.otpExpiration = undefined;
            user.isVerified = true;
            await user.save();

            res.status(200).json({
                _id: user._id,
                name: user.name,
                mobileNumber: user.mobileNumber,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid or expired OTP');
        }
    })
);

// --- START MODIFICATION: Add forgot password endpoints ---
// @desc    Request password reset and send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
router.post(
    '/forgot-password',
    asyncHandler(async (req, res) => {
        const { mobileNumber } = req.body;
        const user = await User.findOne({ mobileNumber });

        if (!user) {
            res.status(404);
            throw new Error('User not found with this mobile number');
        }

        const otp = generateOTP();
        const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        user.otp = otp;
        user.otpExpiration = otpExpiration;
        await user.save();

        await sendOtp(mobileNumber, otp);

        res.status(200).json({
            message: 'OTP sent to your mobile number. Please enter it to reset your password.',
        });
    })
);

// @desc    Verify OTP and reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post(
    '/reset-password',
    asyncHandler(async (req, res) => {
        const { mobileNumber, otp, newPassword } = req.body;
        const user = await User.findOne({ mobileNumber });

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        if (user.otp === otp && user.otpExpiration > Date.now()) {
            user.password = newPassword;
            user.otp = undefined;
            user.otpExpiration = undefined;
            await user.save();

            res.status(200).json({
                message: 'Password has been reset successfully.',
            });
        } else {
            res.status(400);
            throw new Error('Invalid or expired OTP');
        }
    })
);

// --- END MODIFICATION ---

// =============================================
// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
// =============================================
router.post(
    '/login',
    asyncHandler(async (req, res) => {
        const { mobileNumber, password } = req.body;
        const user = await User.findOne({ mobileNumber });

        if (user && user.isVerified && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                mobileNumber: user.mobileNumber,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid mobile number or password');
        }
    })
);

module.exports = router;
