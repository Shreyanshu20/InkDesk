const User = require('../models/user.model');
const Address = require('../models/address.model');
const bcrypt = require('bcryptjs');
const { transporter } = require('../config/nodemailer');
const { profileEmailTemplates } = require('../config/profileEmailTemplates');


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

        // Track what fields were updated
        const updatedFields = [];
        
        if (user.first_name !== first_name.trim()) {
            updatedFields.push(`First Name: ${first_name.trim()}`);
        }
        if (user.last_name !== last_name.trim()) {
            updatedFields.push(`Last Name: ${last_name.trim()}`);
        }
        if (user.phone !== (phone ? phone.trim() : "")) {
            updatedFields.push(`Phone: ${phone ? phone.trim() : 'Removed'}`);
        }

        user.first_name = first_name.trim();
        user.last_name = last_name.trim();
        user.phone = phone ? phone.trim() : "";

        await user.save();

        // Send email notification if fields were updated
        if (updatedFields.length > 0) {
            try {
                const profileUpdateTemplate = profileEmailTemplates.profileUpdateSuccess(user, updatedFields);
                const mailOptions = {
                    from: process.env.SENDER_EMAIL,
                    to: user.email,
                    subject: profileUpdateTemplate.subject,
                    html: profileUpdateTemplate.html,
                    text: profileUpdateTemplate.text
                };

                await transporter.sendMail(mailOptions);
            } catch (emailError) {
                
            }
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

        // Send email notification
        try {
            const passwordChangeTemplate = profileEmailTemplates.passwordChangeSuccess(user);
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: passwordChangeTemplate.subject,
                html: passwordChangeTemplate.html,
                text: passwordChangeTemplate.text
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            // Silent email error - don't fail the password change if email fails
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

        await User.findByIdAndDelete(userId);

        res.clearCookie('userToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
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

module.exports.getAddress = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).populate('address_details');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            addresses: user.address_details || []
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching addresses',
            error: error.message
        });
    }
};

module.exports.saveAddress = async (req, res) => {
    try {
        const userId = req.userId;

        const {
            first_name,
            last_name,
            phone,
            address_line_1,
            city,
            state,
            postal_code,
            country,
            is_primary
        } = req.body;

        if (!first_name || !last_name || !phone || !address_line_1 || !city || !state || !postal_code) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (is_primary) {
            await Address.updateMany(
                { user_id: userId, is_primary: true },
                { is_primary: false }
            );
        }

        const newAddress = new Address({
            user_id: userId,
            first_name,
            last_name,
            phone,
            address_line_1,
            address_line_2: req.body.address_line_2 || '',
            city,
            state,
            postal_code,
            country: country || 'India',
            is_primary: is_primary || false
        });

        const savedAddress = await newAddress.save();

        user.address_details.push(savedAddress._id);
        await user.save();

        res.json({
            success: true,
            message: 'Address saved successfully',
            address: savedAddress
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error saving address',
            error: error.message
        });
    }
};

module.exports.updateAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const addressId = req.params.id;

        const {
            first_name,
            last_name,
            phone,
            address_line_1,
            city,
            state,
            postal_code,
            country,
            is_primary
        } = req.body;

        const address = await Address.findOne({ _id: addressId, user_id: userId });
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found or unauthorized'
            });
        }

        if (is_primary && !address.is_primary) {
            await Address.updateMany(
                { user_id: userId, is_primary: true },
                { is_primary: false }
            );
        }

        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            {
                first_name,
                last_name,
                phone,
                address_line_1,
                address_line_2: req.body.address_line_2 || '',
                city,
                state,
                postal_code,
                country: country || 'India',
                is_primary: is_primary || false
            },
            { new: true }
        );

        res.json({
            success: true,
            message: 'Address updated successfully',
            address: updatedAddress
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating address',
            error: error.message
        });
    }
};

module.exports.deleteAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const addressId = req.params.id;

        const address = await Address.findOneAndDelete({ _id: addressId, user_id: userId });
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found or unauthorized'
            });
        }

        await User.findByIdAndUpdate(userId, {
            $pull: { address_details: addressId }
        });

        res.json({
            success: true,
            message: 'Address deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting address',
            error: error.message
        });
    }
};