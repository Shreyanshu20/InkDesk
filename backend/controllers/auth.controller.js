const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model.js');
const Address = require('../models/address.model.js');
const { transporter } = require('../config/nodemailer');
const { profileChangeEmailTemplate } = require('../config/profileEmailTemplates');
const { authEmailTemplates } = require('../config/authEmailTemplates');

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

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Send welcome email with beautiful template
        try {
            const welcomeTemplate = authEmailTemplates.welcomeEmail(newUser);
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: welcomeTemplate.subject,
                html: welcomeTemplate.html,
                text: welcomeTemplate.text
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.log('Welcome email error:', emailError);
            // Don't fail registration if email fails
        }

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
};

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
};

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

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 10 * 60 * 1000;
        user.verify_Otp = otp;
        user.verify_Otp_expiry = expiry;
        await user.save();

        // Send OTP with beautiful template
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

        // Send verification success email with beautiful template
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
            console.log('Verification success email error:', emailError);
            // Don't fail verification if email fails
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

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 10 * 60 * 1000;
        user.forget_password_otp = otp;
        user.forget_password_otp_expiry = expiry;
        await user.save();

        // Send forgot password email with beautiful template
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
};

module.exports.isAuth = async (req, res) => {
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
            message: "Authentication check failed"
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

    if (!first_name || !last_name || !phone) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields (first name, last name, phone)"
        });
    }

    const phoneRegex = /^[\+]?[1-9][\d]{7,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid phone number"
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
        user.phone = phone.trim();

        await user.save();

        try {
            const emailTemplate = profileChangeEmailTemplate(user, 'profile', {
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone
            });

            const mailOptions = {
                from: process.env.SENDER_EMAIL,
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

        if (country === "India") {
            const indiaPostalRegex = /^[1-9][0-9]{5}$/;
            if (!indiaPostalRegex.test(postal_code)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid postal code for India. Please enter a 6-digit postal code."
                });
            }
        } else if (country === "United States") {
            const usPostalRegex = /^\d{5}(-\d{4})?$/;
            if (!usPostalRegex.test(postal_code)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid postal code for United States. Use format: 12345 or 12345-6789"
                });
            }
        } else {
            if (postal_code.length < 3 || postal_code.length > 10) {
                return res.status(400).json({
                    success: false,
                    message: "Postal code must be between 3 and 10 characters"
                });
            }
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
                const updatedAddress = await Address.findByIdAndUpdate(
                    existingAddress._id,
                    addressData,
                    { new: true, runValidators: true }
                );

                if (updatedAddress) {
                    savedAddress = updatedAddress;
                } else {
                    const newAddress = new Address(addressData);
                    savedAddress = await newAddress.save();
                    user.address_details = [savedAddress._id];
                    await user.save();
                }
            } else {
                const newAddress = new Address(addressData);
                savedAddress = await newAddress.save();
                user.address_details = [savedAddress._id];
                await user.save();
            }
        } else {
            const newAddress = new Address(addressData);
            savedAddress = await newAddress.save();
            user.address_details = [savedAddress._id];
            await user.save();
        }

        try {
            const emailTemplate = profileChangeEmailTemplate(user, 'address', {
                address_line1: savedAddress.address_line_1,
                address_line2: savedAddress.address_line_2,
                city: savedAddress.city,
                state: savedAddress.state,
                postal_code: savedAddress.postal_code,
                country: savedAddress.country
            });

            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: emailTemplate.subject,
                html: emailTemplate.html,
                text: emailTemplate.text
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            // Email error handling without exposing to user
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

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        await user.save();

        try {
            const emailTemplate = profileChangeEmailTemplate(user, 'password');

            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: emailTemplate.subject,
                html: emailTemplate.html,
                text: emailTemplate.text
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            // Email error handling without exposing to user
        }

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
            const emailTemplate = profileChangeEmailTemplate(user, 'account_deleted');

            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: emailTemplate.subject,
                html: emailTemplate.html,
                text: emailTemplate.text
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            // Email error handling without exposing to user
        }

        try {
            if (user.address_details && user.address_details.length > 0) {
                await Address.deleteMany({ _id: { $in: user.address_details } });
            }
        } catch (addressError) {
            // Address deletion error handling
        }

        await User.findByIdAndDelete(userId);

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
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