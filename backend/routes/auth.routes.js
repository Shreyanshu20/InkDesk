const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model.js');
const Address = require('../models/address.model.js');
const { transporter } = require('../config/nodemailer');
const { authEmailTemplates } = require('../config/authEmailTemplates');

// Import middleware - make sure this path is correct
const { userAuth } = require('../middleware/userAuth');

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Test route to check if auth routes are working
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Auth routes are working!',
        timestamp: new Date().toISOString()
    });
});

// Register user
router.post('/register', async (req, res) => {
    console.log('📝 Register request received:', req.body);
    
    const { first_name, last_name, email, password, role } = req.body;

    if (!first_name || !last_name || !email || !password) {
        console.log('❌ Missing required fields');
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields"
        });
    }

    try {
        console.log('🔍 Checking if user exists:', email);
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log('❌ User already exists:', email);
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        console.log('🔒 Hashing password...');
        const hashPassword = await bcrypt.hash(password, 10);

        console.log('👤 Creating new user...');
        const newUser = new User({
            first_name,
            last_name,
            email,
            password: hashPassword,
            role: role || "customer",
            isAccountVerified: false,
            status: "active",
            verificationOTP: generateOTP(),
            verificationOTPExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });

        const savedUser = await newUser.save();
        console.log('✅ User created successfully:', savedUser._id);

        // Send verification email
        try {
            if (authEmailTemplates && authEmailTemplates.verificationOtp) {
                const emailTemplate = authEmailTemplates.verificationOtp(newUser, newUser.verificationOTP);
                await transporter.sendMail({
                    from: process.env.EMAIL_FROM || 'noreply@inkdesk.com',
                    to: email,
                    subject: emailTemplate.subject,
                    html: emailTemplate.html,
                    text: emailTemplate.text
                });
                console.log('📧 Verification email sent');
            }
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError);
            // Don't fail registration if email fails
        }

        res.status(201).json({
            success: true,
            message: "User registered successfully! Please check your email for verification.",
            user: {
                id: savedUser._id,
                first_name: savedUser.first_name,
                last_name: savedUser.last_name,
                email: savedUser.email,
                role: savedUser.role,
                isAccountVerified: savedUser.isAccountVerified
            }
        });

    } catch (err) {
        console.error('❌ Registration error:', err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    console.log('🔐 Login request received:', { email: req.body.email });
    
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('❌ Missing email or password');
        return res.status(400).json({
            success: false,
            message: "Please provide email and password"
        });
    }

    try {
        console.log('🔍 Looking for user:', email);
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        console.log('🔒 Comparing passwords...');
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('❌ Password mismatch for:', email);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        console.log('🎫 Generating JWT token...');
        // Make sure JWT_SECRET_USER is defined
        if (!process.env.JWT_SECRET_USER) {
            console.error('❌ JWT_SECRET_USER not defined in environment variables');
            return res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET_USER,
            { expiresIn: '7d' }
        );

        console.log('🍪 Setting cookie...');
        // Set cookie
        res.cookie('userToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
        });

        console.log('✅ Login successful for:', email);
        res.json({
            success: true,
            message: "Login successful",
            token: token, // Always return token for frontend storage
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                isAccountVerified: user.isAccountVerified,
                phone: user.phone,
                status: user.status
            }
        });

    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Check if user is authenticated
router.post('/is-auth', async (req, res) => {
    try {
        console.log('🔐 Auth check request received');
        console.log('🍪 Cookies:', req.cookies);
        console.log('🎫 Authorization header:', req.headers.authorization);
        
        // Check for token in cookies first, then Authorization header
        let token = req.cookies.userToken || req.cookies.token;
        
        // If no cookie token, check Authorization header
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Remove 'Bearer ' prefix
                console.log('🎫 Found token in Authorization header');
            }
        }
        
        if (!token) {
            console.log('❌ No token found in cookies or headers');
            return res.status(401).json({
                success: false,
                message: "No authentication token provided"
            });
        }

        console.log('🎫 Verifying token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
        console.log('✅ Token verified, user ID:', decoded.userId || decoded.id);

        // Handle both possible user ID field names
        const userId = decoded.userId || decoded.id;
        const user = await User.findById(userId).select('-password -verificationOTP');
        
        if (!user) {
            console.log('❌ User not found for ID:', userId);
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log('✅ User authenticated:', user.email);
        res.json({
            success: true,
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                isAccountVerified: user.isAccountVerified,
                phone: user.phone,
                status: user.status,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('❌ Auth check error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired"
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Error checking authentication"
        });
    }
});

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        console.log('👤 Profile request received');
        console.log('🍪 Cookies:', req.cookies);
        console.log('🎫 Authorization header:', req.headers.authorization);
        
        // Check for token in cookies first, then Authorization header
        let token = req.cookies.userToken || req.cookies.token;
        
        // If no cookie token, check Authorization header
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
                console.log('🎫 Found token in Authorization header');
            }
        }
        
        if (!token) {
            console.log('❌ No token found in cookies or headers');
            return res.status(401).json({
                success: false,
                message: "No authentication token provided"
            });
        }

        console.log('🎫 Verifying token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
        console.log('✅ Token verified, user ID:', decoded.userId || decoded.id);

        // Handle both possible user ID field names
        const userId = decoded.userId || decoded.id;
        const user = await User.findById(userId)
            .populate('address_details')
            .select('-password -verificationOTP');

        if (!user) {
            console.log('❌ User not found for ID:', userId);
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log('✅ Profile data retrieved for:', user.email);
        res.json({
            success: true,
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                isAccountVerified: user.isAccountVerified,
                status: user.status,
                createdAt: user.createdAt,
                address_line1: user.address_line1,
                address_line2: user.address_line2,
                city: user.city,
                state: user.state,
                postal_code: user.postal_code,
                country: user.country,
                address_details: user.address_details || []
            }
        });
    } catch (error) {
        console.error('❌ Profile fetch error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired"
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Error fetching profile"
        });
    }
});

// Update profile
router.post('/update-profile', userAuth, async (req, res) => {
    try {
        const { first_name, last_name, phone } = req.body;

        if (!first_name || !last_name) {
            return res.status(400).json({
                success: false,
                message: "First name and last name are required"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                first_name: first_name.trim(),
                last_name: last_name.trim(),
                phone: phone ? phone.trim() : ""
            },
            { new: true }
        ).select('-password -verificationOTP');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isAccountVerified: user.isAccountVerified
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: "Error updating profile"
        });
    }
});

// Update address (backward compatibility)
router.post('/update-address', userAuth, async (req, res) => {
    try {
        const { address_line1, address_line2, city, state, postal_code, country } = req.body;

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                address_line1: address_line1?.trim() || "",
                address_line2: address_line2?.trim() || "",
                city: city?.trim() || "",
                state: state?.trim() || "",
                postal_code: postal_code?.trim() || "",
                country: country || "India"
            },
            { new: true }
        ).select('-password -verificationOTP');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "Address updated successfully",
            user
        });
    } catch (error) {
        console.error('Address update error:', error);
        res.status(500).json({
            success: false,
            message: "Error updating address"
        });
    }
});

// Change password
router.put('/change-password', userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Old password and new password are required"
            });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({
            success: false,
            message: "Error changing password"
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('userToken');
    res.json({
        success: true,
        message: "Logged out successfully"
    });
});

// Delete account
router.delete('/delete-account', userAuth, async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required to delete account"
            });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            });
        }

        // Delete user addresses
        if (user.address_details && user.address_details.length > 0) {
            await Address.deleteMany({ _id: { $in: user.address_details } });
        }

        // Delete user account
        await User.findByIdAndDelete(req.userId);

        // Clear cookie
        res.clearCookie('userToken');

        res.json({
            success: true,
            message: "Account deleted successfully"
        });
    } catch (error) {
        console.error('Account deletion error:', error);
        res.status(500).json({
            success: false,
            message: "Error deleting account"
        });
    }
});

// Check if user is admin (specific route for admin panel)
router.post('/is-admin', async (req, res) => {
    try {
        console.log('🔐 Admin auth check request received');
        console.log('🍪 Cookies:', req.cookies);
        console.log('🎫 Authorization header:', req.headers.authorization);
        
        // Check for token in cookies first, then Authorization header
        let token = req.cookies.userToken || req.cookies.token;
        
        // If no cookie token, check Authorization header
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
                console.log('🎫 Found token in Authorization header');
            }
        }
        
        if (!token) {
            console.log('❌ No token found in cookies or headers');
            return res.status(401).json({
                success: false,
                message: "No authentication token provided"
            });
        }

        console.log('🎫 Verifying token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
        console.log('✅ Token verified, user ID:', decoded.userId || decoded.id);

        // Handle both possible user ID field names
        const userId = decoded.userId || decoded.id;
        const user = await User.findById(userId).select('-password -verificationOTP');
        
        if (!user) {
            console.log('❌ User not found for ID:', userId);
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            console.log('❌ User is not admin, role:', user.role);
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        console.log('✅ Admin authenticated:', user.email);
        res.json({
            success: true,
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                isAccountVerified: user.isAccountVerified,
                phone: user.phone,
                status: user.status,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('❌ Admin auth check error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired"
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Error checking authentication"
        });
    }
});

module.exports = router;