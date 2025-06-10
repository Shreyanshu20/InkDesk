const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model.js');
const Address = require('../models/address.model.js');
const { transporter } = require('../config/nodemailer');
const { profileChangeEmailTemplate } = require('../config/profileEmailTemplates');
const { authEmailTemplates } = require('../config/authEmailTemplates');

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
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
            role: role,
            isAccountVerified: false,
            status: "active"
        });

        const savedUser = await newUser.save();
        console.log('✅ User created successfully:', savedUser._id);

        //account creation email
        try {
            const welcomeEmail = authEmailTemplates.welcomeEmail(newUser);
            const mailOptions = {
                from: process.env.SENDER_EMAIL || 'noreply@inkdesk.com',
                to: newUser.email,
                subject: welcomeEmail.subject,
                html: welcomeEmail.html,
                text: welcomeEmail.text
            };

            await transporter.sendMail(mailOptions);
        } catch (err) {
            console.log('Welcome email error:', err);
            return res.status(500).json({
                success: false,
                message: "Failed to send welcome email"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: savedUser._id, email: savedUser.email },
            process.env.JWT_SECRET_USER,
            { expiresIn: '7d' }
        );

        // Set cookie
        res.cookie('userToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
        });

        const otp = generateOTP();
        const expiry = Date.now() + 10 * 60 * 1000;
        newUser.verify_Otp = otp;
        newUser.verify_Otp_expiry = expiry;
        await newUser.save();

        try {
            const otpTemplate = authEmailTemplates.verificationOtp(newUser, otp);
            const mailOptions = {
                from: process.env.SENDER_EMAIL || 'noreply@inkdesk.com',
                to: newUser.email,
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

        res.status(201).json({
            success: true,
            message: "User registered successfully! Please check your email for verification.",
            token: token,
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
        console.error('❌ Registration error:', err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports.login = async (req, res) => {
    console.log('🔐 Login request received:', { email: req.body.email });

    const { email, password, role } = req.body;

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
            token: token,
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
};

module.exports.logout = async (req, res) => {
    try {
        res.clearCookie('userToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
        });
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
                from: process.env.SENDER_EMAIL || 'noreply@inkdesk.com',
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
            const successTemplate = authEmailTemplates.verificationSuccess(user);
            const mailOptions = {
                from: process.env.SENDER_EMAIL || 'noreply@inkdesk.com',
                to: user.email,
                subject: successTemplate.subject,
                html: successTemplate.html,
                text: successTemplate.text
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.log('Verification success email error:', emailError);
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
                from: process.env.EMAIL_FROM || 'noreply@inkdesk.com',
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
            from: process.env.EMAIL_FROM || 'noreply@inkdesk.com',
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

module.exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId)
            .populate('address_details')
            .select('-password -verify_Otp -forget_password_otp');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let addressData = {
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: ''
        };

        if (user.address_details && user.address_details.length > 0) {
            const primaryAddress = user.address_details.find(addr => addr.is_primary) || user.address_details[0];
            if (primaryAddress) {
                addressData = {
                    address_line1: primaryAddress.address_line_1 || '',
                    address_line2: primaryAddress.address_line_2 || '',
                    city: primaryAddress.city || '',
                    state: primaryAddress.state || '',
                    postal_code: primaryAddress.postal_code || '',
                    country: primaryAddress.country || ''
                };
            }
        }

        const userData = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isAccountVerified: user.isAccountVerified,
            status: user.status,
            createdAt: user.createdAt,
            ...addressData
        };

        return res.json({
            success: true,
            user: userData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user profile"
        });
    }
};

module.exports.updateUserProfile = async (req, res) => {
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

        try {
            const emailTemplate = profileChangeEmailTemplate(user, 'profile', {
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone
            });

            const mailOptions = {
                from: process.env.EMAIL_FROM || 'noreply@inkdesk.com',
                to: user.email,
                subject: emailTemplate.subject,
                html: emailTemplate.html,
                text: emailTemplate.text
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            // Email error handling without exposing to user
        }

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

module.exports.updateUserAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { address_line1, address_line2, city, state, postal_code, country } = req.body;

        if (!address_line1 || !city || !postal_code || !country) {
            return res.status(400).json({
                success: false,
                message: "Please provide address line 1, city, postal code, and country"
            });
        }

        const user = await User.findById(userId).populate('address_details');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const addressData = {
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone || '',
            address_line_1: address_line1.trim(),
            address_line_2: address_line2 ? address_line2.trim() : '',
            city: city.trim(),
            state: state ? state.trim() : '',
            postal_code: postal_code.trim(),
            country: country,
            is_primary: true
        };

        let savedAddress;

        if (user.address_details && user.address_details.length > 0) {
            const existingAddress = user.address_details[0];
            if (existingAddress && existingAddress._id) {
                savedAddress = await Address.findByIdAndUpdate(
                    existingAddress._id,
                    addressData,
                    { new: true, runValidators: true }
                );
            }
        } else {
            const newAddress = new Address(addressData);
            savedAddress = await newAddress.save();
            user.address_details = [savedAddress._id];
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            address: savedAddress
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

        try {
            if (user.address_details && user.address_details.length > 0) {
                await Address.deleteMany({ _id: { $in: user.address_details } });
            }
        } catch (addressError) {
            // Address deletion error handling
        }

        await User.findByIdAndDelete(userId);

        res.clearCookie('userToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });

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