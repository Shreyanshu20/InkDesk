const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { transporter } = require("../config/nodemailer");
const { authEmailTemplates } = require("../config/authEmailTemplates");

// Generate 6-digit numeric OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Set cookie with consistent naming and settings
const setCookie = (res, token, rememberMe = true) => {
    const maxAge = rememberMe ? (7 * 24 * 60 * 60 * 1000) : (1 * 24 * 60 * 60 * 1000);

    res.cookie('userToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: maxAge,
        path: '/'
    });

    console.log(`🍪 Cookie set: userToken, maxAge: ${maxAge}ms, secure: ${process.env.NODE_ENV === 'production'}`);
};

// Clear cookie with same settings
const clearCookie = (res) => {
    res.clearCookie('userToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
    });

    console.log('🗑️ Cookie cleared: userToken');
};

module.exports.register = async (req, res) => {
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
                message: "User already exists with this email"
            });
        }

        console.log('🔐 Hashing password...');
        const hashPassword = await bcrypt.hash(password, 10);
        console.log('✅ Password hashed successfully');

        const otp = generateOTP();
        const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        console.log('👤 Creating new user...');
        const newUser = new User({
            first_name,
            last_name,
            email,
            password: hashPassword,
            role: role || "user",
            verify_Otp: otp,
            verify_Otp_expiry: expiry,
            isAccountVerified: false
        });

        console.log('💾 Saving user to database...');
        const savedUser = await newUser.save();
        console.log('✅ User registered successfully:', savedUser._id);

        console.log('🎫 Generating JWT token...');
        const token = jwt.sign(
            { id: savedUser._id, email: savedUser.email, role: savedUser.role },
            process.env.JWT_SECRET_USER,
            { expiresIn: '7d' }
        );
        console.log('✅ JWT token generated');

        setCookie(res, token, true);

        //welcome email
        try {
            console.log('📧 Attempting to send welcome email...');

            const welcomeTemplate = authEmailTemplates.registrationWelcome(savedUser);
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: welcomeTemplate.subject,
                html: welcomeTemplate.html,
                text: welcomeTemplate.text
            };
            console.log('📧 Email template generated successfully');
            console.log('📧 Sending email from:', process.env.SENDER_EMAIL);
            console.log('📧 Sending email to:', email);
            await transporter.sendMail(mailOptions);
            console.log('✅ Welcome email sent successfully');
        }
        catch (emailError) {
            console.log('⚠️ Welcome email error (continuing with registration):', emailError.message);
            console.log('⚠️ Email error stack:', emailError.stack);
        }

        // Try to send OTP email - but don't fail registration if email fails
        try {
            console.log('📧 Attempting to send OTP email...');

            if (!process.env.SENDER_EMAIL || !process.env.SMTP_USER) {
                console.log('⚠️ Email config missing, skipping email send');
            } else {
                // FIXED: Use correct function name - accountVerification (not accountVerificationn)
                const otpTemplate = authEmailTemplates.verificationOtp(savedUser, otp);
                const mailOptions = {
                    from: process.env.SENDER_EMAIL,
                    to: email,
                    subject: otpTemplate.subject,
                    html: otpTemplate.html,
                    text: otpTemplate.text
                };

                console.log('📧 Email template generated successfully');
                console.log('📧 Sending email from:', process.env.SENDER_EMAIL);
                console.log('📧 Sending email to:', email);

                await transporter.sendMail(mailOptions);
                console.log('✅ Registration OTP email sent successfully');
            }
        } catch (emailError) {
            console.log('⚠️ Registration email error (continuing with registration):', emailError.message);
            console.log('⚠️ Email error stack:', emailError.stack);
            // Don't fail registration if email fails
        }

        console.log('✅ Registration complete, sending response');
        res.status(201).json({
            success: true,
            message: "User registered successfully! Please check your email for verification.",
            user: {
                id: savedUser._id,
                first_name: savedUser.first_name,
                last_name: savedUser.last_name,
                email: savedUser.email,
                role: savedUser.role,
                isAccountVerified: savedUser.isAccountVerified,
                phone: savedUser.phone,
                status: savedUser.status
            }
        });

    } catch (err) {
        console.error('❌ Registration error details:', {
            message: err.message,
            stack: err.stack,
            name: err.name
        });

        // Send specific error based on type
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation error: " + Object.values(err.errors).map(e => e.message).join(', ')
            });
        }

        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        res.status(500).json({
            success: false,
            message: "Registration failed: " + err.message
        });
    }
};

module.exports.login = async (req, res) => {
    console.log('🔐 Login request received:', { email: req.body.email, rememberMe: req.body.rememberMe });

    const { email, password, role, rememberMe = true } = req.body;

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

        if (role !== user.role) {
            console.log('❌ User role mismatch:', user.role, 'expected:', role);
            return res.status(403).json({
                success: false,
                message: "Access denied. Incorrect user role"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('❌ Invalid password for user:', email);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // FIXED: Use JWT_SECRET_USER from .env
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET_USER, // FIXED: Use correct env variable
            { expiresIn: rememberMe ? '7d' : '1d' }
        );

        setCookie(res, token, rememberMe);

        console.log(`✅ Login successful for: ${email}, Role: ${user.role}, Remember Me: ${rememberMe}`);

        res.json({
            success: true,
            message: "Login successful",
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
            message: "Internal server error"
        });
    }
};

module.exports.logout = async (req, res) => {
    try {
        clearCookie(res);
        return res.json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports.sendVerificationEmail = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({
                success: false,
                message: "Account already verified"
            });
        }

        const otp = generateOTP();
        const expiry = Date.now() + 10 * 60 * 1000;
        user.verify_Otp = otp;
        user.verify_Otp_expiry = expiry;
        await user.save();

        try {
            const otpTemplate = authEmailTemplates.verificationOtp(user, otp);
            const mailOptions = {
                from: process.env.SENDER_EMAIL, // FIXED: Use SENDER_EMAIL
                to: user.email,
                subject: otpTemplate.subject,
                html: otpTemplate.html,
                text: otpTemplate.text
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.log('OTP email error:', emailError);
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email"
            });
        }

        return res.json({
            success: true,
            message: "OTP sent successfully",
            email: user.email
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Error sending OTP"
        });
    }
};

module.exports.verifyAccount = async (req, res) => {
    const userId = req.userId;
    const { otp } = req.body;

    if (!otp) {
        return res.status(400).json({
            success: false,
            message: "OTP is required"
        });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.verify_Otp === '' || user.verify_Otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.verify_Otp_expiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }

        user.isAccountVerified = true;
        user.verify_Otp = '';
        user.verify_Otp_expiry = 0;

        await user.save();

        try {
            console.log('📧 Sending verification success email...');
            const successTemplate = authEmailTemplates.verificationSuccess(user);
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: successTemplate.subject,
                html: successTemplate.html,
                text: successTemplate.text
            };

            await transporter.sendMail(mailOptions);
            console.log('✅ Verification success email sent successfully');
        } catch (emailError) {
            console.log('⚠️ Verification success email error:', emailError.message);
        }

        return res.json({
            success: true,
            message: "Account verified successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports.sendResetPasswordEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const otp = generateOTP();
        const expiry = Date.now() + 10 * 60 * 1000;
        user.forget_password_otp = otp;
        user.forget_password_otp_expiry = expiry;
        await user.save();

        try {
            const forgotTemplate = authEmailTemplates.forgotPassword(user, otp);
            const mailOptions = {
                from: process.env.SENDER_EMAIL, // FIXED: Use SENDER_EMAIL
                to: user.email,
                subject: forgotTemplate.subject,
                html: forgotTemplate.html,
                text: forgotTemplate.text
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.log('Forgot password email error:', emailError);
            return res.status(500).json({
                success: false,
                message: "Failed to send reset password email"
            });
        }

        return res.json({
            success: true,
            message: "OTP sent successfully",
            email: user.email
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Error sending OTP"
        });
    }
};

module.exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields"
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.forget_password_otp === '' || user.forget_password_otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.forget_password_otp_expiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        user.forget_password_otp = '';
        user.forget_password_otp_expiry = 0;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL, // FIXED: Use SENDER_EMAIL
            to: user.email,
            subject: 'Password Reset Successful',
            text: `Hello ${user.first_name},\n\nYour password has been reset successfully.\n\nBest regards,\nInkDesk Team`
        };

        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports.isAuth = async (req, res) => {
    try {
        console.log('🔐 Auth check request received');
        console.log('🍪 Cookies:', req.cookies);
        console.log('🎫 Authorization header:', req.headers.authorization);

        // Check for token in cookies first, then Authorization header
        let token = req.cookies.userToken || req.cookies.token;

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
        // FIXED: Use JWT_SECRET_USER from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
        console.log('✅ Token verified, user ID:', decoded.userId || decoded.id);

        const userId = decoded.userId || decoded.id;
        const user = await User.findById(userId).select('-password -verify_Otp -forget_password_otp');

        if (!user) {
            console.log('❌ User not found for ID:', userId);
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if this is an admin check request
        const isAdminCheck = req.path === '/is-admin';
        if (isAdminCheck && user.role !== 'admin') {
            console.log('❌ User is not admin, role:', user.role);
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
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
};

module.exports.getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password -verify_Otp -forget_password_otp');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isAccountVerified: user.isAccountVerified,
                status: user.status,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user profile"
        });
    }
};

module.exports.updateProfile = async (req, res) => {
    const { first_name, last_name, phone } = req.body;
    const userId = req.userId;

    if (!first_name || !last_name) {
        return res.status(400).json({
            success: false,
            message: "First name and last name are required"
        });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.first_name = first_name.trim();
        user.last_name = last_name.trim();
        user.phone = phone ? phone.trim() : "";

        await user.save();

        return res.json({
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
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to update profile. Please try again."
        });
    }
};

module.exports.updateAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { address_line1, address_line2, city, state, postal_code, country } = req.body;

        if (!address_line1 || !city || !postal_code || !country) {
            return res.status(400).json({
                success: false,
                message: "Please provide address line 1, city, postal code, and country"
            });
        }

        // For now, just return success - you can implement address storage later
        return res.status(200).json({
            success: true,
            message: "Address updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the address"
        });
    }
};

module.exports.changePassword = async (req, res) => {
    try {
        const userId = req.userId;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Old password and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters long"
            });
        }

        const user = await User.findById(userId);
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

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to change password. Please try again."
        });
    }
};

module.exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.userId;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required to delete account"
            });
        }

        const user = await User.findById(userId);
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

        await User.findByIdAndDelete(userId);
        clearCookie(res);

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete account. Please try again."
        });
    }
};

// ADD these functions if they don't exist
const isAuthenticated = (req, res, next) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

const isAdmin = (req, res, next) => {
    try {
        if (!req.userId || req.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Authorization error'
        });
    }
};

const isAdminOrUser = (req, res, next) => {
    try {
        if (!req.role || (req.role !== 'admin' && req.role !== 'user')) {
            return res.status(403).json({
                success: false,
                message: 'Authentication required'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during access verification'
        });
    }
};

const adminCheck = async (req, res) => {
    try {
        const userId = req.userId;
        const userRole = req.role;
        
        if (!userId || !userRole) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        if (userRole !== 'admin' && userRole !== 'user') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const User = require('../models/user.model');
        const user = await User.findById(userId).select('-password -verify_Otp -forget_password_otp');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            isAdmin: userRole === 'admin',
            isReadOnly: userRole === 'user',
            role: userRole,
            user: {
                id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during admin verification'
        });
    }
};

// Update your module.exports to include ALL functions
module.exports = {
    register: module.exports.register,
    login: module.exports.login,
    logout: module.exports.logout,
    sendVerificationEmail: module.exports.sendVerificationEmail,
    verifyAccount: module.exports.verifyAccount,
    sendResetPasswordEmail: module.exports.sendResetPasswordEmail,
    resetPassword: module.exports.resetPassword,
    isAuth: module.exports.isAuth,
    getProfile: module.exports.getProfile,
    updateProfile: module.exports.updateProfile,
    updateAddress: module.exports.updateAddress,
    changePassword: module.exports.changePassword,
    deleteAccount: module.exports.deleteAccount,
    isAuthenticated,
    isAdmin,
    isAdminOrUser,
    adminCheck
};

