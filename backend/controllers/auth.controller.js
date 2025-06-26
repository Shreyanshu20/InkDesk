const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { transporter } = require("../config/nodemailer");
const { authEmailTemplates } = require("../config/authEmailTemplates");

// ========== UTILITY FUNCTIONS ==========//
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const setCookie = (res, token, rememberMe = true) => {
    const maxAge = rememberMe ? (7 * 24 * 60 * 60 * 1000) : (1 * 24 * 60 * 60 * 1000);

    res.cookie('userToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: maxAge,
        path: '/'
    });
};

const clearCookie = (res) => {
    res.clearCookie('userToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
    });
};

// ========== AUTHENTICATION CONTROLLER FUNCTIONS ==========//

module.exports.register = async (req, res) => {
    const { first_name, last_name, email, password, role } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields"
        });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const expiry = Date.now() + 10 * 60 * 1000;

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

        const savedUser = await newUser.save();

        const token = jwt.sign(
            { id: savedUser._id, email: savedUser.email, role: savedUser.role },
            process.env.JWT_SECRET_USER,
            { expiresIn: '7d' }
        );

        setCookie(res, token, true);

        try {
            const welcomeTemplate = authEmailTemplates.registrationWelcome(savedUser);
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: welcomeTemplate.subject,
                html: welcomeTemplate.html,
                text: welcomeTemplate.text
            };
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            // Silent email error
        }

        try {
            const otpTemplate = authEmailTemplates.verificationOtp(savedUser, otp);
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: otpTemplate.subject,
                html: otpTemplate.html,
                text: otpTemplate.text
            };
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            // Silent email error
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
                isAccountVerified: savedUser.isAccountVerified,
                phone: savedUser.phone,
                status: savedUser.status
            }
        });

    } catch (err) {
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
    const { email, password, rememberMe = true } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide email and password"
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { 
                id: user._id,
                userId: user._id,
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET_USER,
            { expiresIn: rememberMe ? '7d' : '1d' }
        );

        setCookie(res, token, rememberMe);

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

// ========== EMAIL VERIFICATION CONTROLLER FUNCTIONS ==========//
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
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: otpTemplate.subject,
                html: otpTemplate.html,
                text: otpTemplate.text
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
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
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: successTemplate.subject,
                html: successTemplate.html,
                text: successTemplate.text
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            // Silent email error
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

// ========== PASSWORD RESET CONTROLLER FUNCTIONS ==========//
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
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: forgotTemplate.subject,
                html: forgotTemplate.html,
                text: forgotTemplate.text
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
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

        try {
            const resetSuccessTemplate = authEmailTemplates.passwordResetSuccess(user);
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: resetSuccessTemplate.subject,
                html: resetSuccessTemplate.html,
                text: resetSuccessTemplate.text
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            // Silent email error - don't fail the password reset if email fails
        }

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

// ========== USER AUTHENTICATION STATUS CONTROLLER FUNCTIONS ==========//
module.exports.isAuth = async (req, res) => {
    try {
        let token = req.cookies.userToken || req.cookies.token;

        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No authentication token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
        const userId = decoded.userId || decoded.id;
        const user = await User.findById(userId).select('-password -verify_Otp -forget_password_otp');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isAdminCheck = req.path === '/is-admin';
        if (isAdminCheck) {
            if (!['admin', 'user'].includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. Invalid role for admin panel access."
                });
            }
        }

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