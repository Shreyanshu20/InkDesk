const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model.js');
const Address = require('../models/address.model.js');
const { transporter } = require('../config/nodemailer');

// This function handles user registration by creating a new user in the database
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
                message: "User already exists"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            first_name,
            last_name,
            email,
            password: hashPassword,
            role
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set cookie with token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to InkDesk',
            text: `Hello ${first_name},\n\nThank you for registering with InkDesk. Your account has been created successfully.\n\nBest regards,\nInkDesk Team`
        };

        transporter.sendMail(mailOptions);
        console.log("Welcome email sent successfully");


        return res.json({
            success: true,
            message: "User registered successfully",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }

}

// This function handles user login by verifying credentials and generating a JWT token
module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields"
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role || 'user'
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Add this line - return a response with user data
        return res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                isAccountVerified: user.isAccountVerified,
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// This function handles user logout by clearing the cookie
module.exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
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
}

// This function sends a verification email to the user with an OTP
module.exports.sendVerificationEmail = async (req, res) => {
    try {
        // Use userId from middleware instead of request body
        const userId = req.userId;

        console.log("Sending verification email for userId:", userId);

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

        // Remove role check - we already verified they're authenticated

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        user.verify_Otp = otp;
        user.verify_Otp_expiry = expiry;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify your account',
            text: `Hello ${user.first_name},\n\nYour verification OTP is ${otp}. It is valid for 10 minutes.\n\nBest regards,\nInkDesk Team`
        };

        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: "OTP sent successfully",
            email: user.email
        });

    } catch (err) {
        console.error("OTP sending error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Error sending OTP"
        });
    }
}

// This function verifies the account using the OTP sent to the user's email
module.exports.verifyAccount = async (req, res) => {
    // Get userId from auth middleware instead of request body
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

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verified successfully',
            text: `Hello ${user.first_name},\n\nYour account has been verified successfully.\n\nBest regards,\nInkDesk Team`
        };

        await transporter.sendMail(mailOptions);

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
}

// Middleware to check if user is authenticated
module.exports.isAuthenticated = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('address_details');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Get address details if available
        let addressLine1 = '';
        let addressLine2 = '';
        let city = '';
        let state = '';
        let postalCode = '';
        let country = '';

        if (user.address_details && user.address_details.length > 0) {
            const address = user.address_details[0];

            // Split address_line into line1 and line2 if it contains a comma
            if (address.address_line) {
                const parts = address.address_line.split(', ');
                addressLine1 = parts[0] || '';
                addressLine2 = parts.length > 1 ? parts.slice(1).join(', ') : '';
            }

            city = address.city || '';
            state = address.state || '';
            postalCode = address.pincode || '';
            country = address.country || '';
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                isAccountVerified: user.isAccountVerified,
                phone: user.phone,
                address_line1: addressLine1,
                address_line2: addressLine2,
                city: city,
                state: state,
                postal_code: postalCode,
                country: country,
                status: user.status
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// This function sends a password reset OTP to the user's email
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

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 10 * 60 * 1000;
        user.forget_password_otp = otp;
        user.forget_password_otp_expiry = expiry;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Reset Password',
            text: `Hello ${user.first_name},\n\nYour password reset OTP is ${otp}. It is valid for 10 minutes.\n\nBest regards,\nInkDesk Team`
        };

        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: "OTP sent successfully",
            email: user.email
        });

    } catch (err) {
        console.error("OTP sending error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Error sending OTP"
        });
    }
}

// This function resets the password using the OTP sent to the user's email
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
            from: process.env.SENDER_EMAIL,
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
}

module.exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userId;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields"
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

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Changed Successfully',
            text: `Hello ${user.first_name},\n\nYour password has been changed successfully.\n\nBest regards,\nInkDesk Team`
        };

        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports.updateUserProfile = async (req, res) => {
    const { first_name, last_name, email, phone } = req.body;
    const userId = req.userId;

    if (!first_name || !last_name || !email || !phone) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields"
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

        user.first_name = first_name;
        user.last_name = last_name;
        user.email = email;
        user.phone = phone;

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
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports.updateUserAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { address_line1, address_line2, city, state, postal_code, country } = req.body;

        // Validate required fields
        if (!address_line1 || !city || !postal_code || !country) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required address fields"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user already has an address
        if (user.address_details && user.address_details.length > 0) {
            // Update existing address
            const existingAddress = await Address.findById(user.address_details[0]);

            if (existingAddress) {
                existingAddress.address_line = address_line1 + (address_line2 ? ', ' + address_line2 : '');
                existingAddress.city = city;
                existingAddress.state = state || '';
                existingAddress.country = country;
                existingAddress.pincode = postal_code;

                await existingAddress.save();
            } else {
                // Create new address if reference exists but address doesn't
                const newAddress = new Address({
                    address_line: address_line1 + (address_line2 ? ', ' + address_line2 : ''),
                    city: city,
                    state: state || '',
                    country: country,
                    pincode: postal_code,
                    user_id: userId
                });

                const savedAddress = await newAddress.save();

                // Update user's address reference
                user.address_details = [savedAddress._id];
                await user.save();
            }
        } else {
            // Create first address for user
            const newAddress = new Address({
                address_line: address_line1 + (address_line2 ? ', ' + address_line2 : ''),
                city: city,
                state: state || '',
                country: country,
                pincode: postal_code,
                user_id: userId
            });

            const savedAddress = await newAddress.save();

            // Add address to user's address_details
            user.address_details = [savedAddress._id];
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: "Address updated successfully"
        });
    } catch (error) {
        console.error("Update address error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the address"
        });
    }
}

// Get user profile - uses userAuth middleware to get userId from token
module.exports.getProfile = async (req, res) => {
    try {
        // req.userId is already available from userAuth middleware
        const user = await User.findById(req.userId)
            .select('-password -verify_Otp -forget_password_otp'); // Exclude sensitive fields
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Profile fetched successfully',
            user: {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                isAccountVerified: user.isAccountVerified,
                status: user.status,
                createdAt: user.createdAt
            }
        });
        
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
};