const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const User = require('../models/User.model');
const Address = require('../models/address.model');

// Get user addresses
router.get('/addresses', userAuth, async (req, res) => {
    try {
        const userId = req.userId;
        console.log('📍 GET /user/addresses called for user:', userId);

        // Find user and populate address details
        const user = await User.findById(userId).populate('address_details');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('📍 Found addresses:', user.address_details?.length || 0);

        res.json({
            success: true,
            addresses: user.address_details || []
        });

    } catch (error) {
        console.error('❌ Error fetching addresses:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching addresses',
            error: error.message
        });
    }
});

// Save new address
router.post('/addresses', userAuth, async (req, res) => {
    try {
        const userId = req.userId;
        console.log('📍 POST /user/addresses called for user:', userId);

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

        // Validate required fields
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

        // If setting as primary, update existing primary addresses
        if (is_primary) {
            await Address.updateMany(
                { _id: { $in: user.address_details } },
                { is_primary: false }
            );
        }

        // Create new address
        const newAddress = new Address({
            first_name,
            last_name,
            phone,
            address_line_1,
            city,
            state,
            postal_code,
            country: country || 'India',
            is_primary: is_primary || user.address_details.length === 0
        });

        const savedAddress = await newAddress.save();

        // Add to user's address list
        user.address_details.push(savedAddress._id);
        await user.save();

        console.log('📍 Address saved and added to user successfully');

        res.status(201).json({
            success: true,
            message: 'Address saved successfully',
            address: savedAddress
        });
    } catch (error) {
        console.error('❌ Error saving address:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving address',
            error: error.message
        });
    }
});

// Update address
router.put('/addresses/:addressId', userAuth, async (req, res) => {
    try {
        const { addressId } = req.params;
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

        console.log('📍 PUT /user/addresses/:addressId called');

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if address belongs to user
        const addressExists = user.address_details.some(addr => addr.toString() === addressId);
        if (!addressExists) {
            return res.status(403).json({
                success: false,
                message: 'Address not found or not authorized'
            });
        }

        // If setting as primary, update existing primary addresses
        if (is_primary) {
            await Address.updateMany(
                { _id: { $in: user.address_details } },
                { is_primary: false }
            );
        }

        // Update the address
        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            {
                first_name,
                last_name,
                phone,
                address_line_1,
                city,
                state,
                postal_code,
                country: country || 'India',
                is_primary
            },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        res.json({
            success: true,
            message: 'Address updated successfully',
            address: updatedAddress
        });

    } catch (error) {
        console.error('❌ Error updating address:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating address',
            error: error.message
        });
    }
});

// Delete address
router.delete('/addresses/:addressId', userAuth, async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.userId;

        console.log('📍 DELETE /user/addresses/:addressId called');

        // Find the user
        const user = await User.findById(userId).populate('address_details');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if address belongs to user
        const addressExists = user.address_details.some(addr => addr._id.toString() === addressId);
        if (!addressExists) {
            return res.status(403).json({
                success: false,
                message: 'Address not found or not authorized'
            });
        }

        // Delete the address
        await Address.findByIdAndDelete(addressId);

        // Remove from user's address list
        user.address_details = user.address_details.filter(addr => addr._id.toString() !== addressId);
        await user.save();

        res.json({
            success: true,
            message: 'Address deleted successfully'
        });

    } catch (error) {
        console.error('❌ Error deleting address:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting address',
            error: error.message
        });
    }
});

module.exports = router;