const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

// Import models properly to avoid overwrite error
const User = require('../models/user.model');
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
                { user_id: userId, is_primary: true },
                { is_primary: false }
            );
        }

        // Create new address
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

        // Add address to user's address list
        user.address_details.push(savedAddress._id);
        await user.save();

        console.log('✅ Address saved successfully:', savedAddress._id);

        res.json({
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
router.put('/addresses/:id', userAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const addressId = req.params.id;
        console.log('📍 PUT /user/addresses called for:', addressId);

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

        // Find the address and verify ownership
        const address = await Address.findOne({ _id: addressId, user_id: userId });
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found or unauthorized'
            });
        }

        // If setting as primary, update existing primary addresses
        if (is_primary && !address.is_primary) {
            await Address.updateMany(
                { user_id: userId, is_primary: true },
                { is_primary: false }
            );
        }

        // Update address
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

        console.log('✅ Address updated successfully:', addressId);

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
router.delete('/addresses/:id', userAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const addressId = req.params.id;
        console.log('📍 DELETE /user/addresses called for:', addressId);

        // Find and delete the address
        const address = await Address.findOneAndDelete({ _id: addressId, user_id: userId });
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found or unauthorized'
            });
        }

        // Remove address from user's address list
        await User.findByIdAndUpdate(userId, {
            $pull: { address_details: addressId }
        });

        console.log('✅ Address deleted successfully:', addressId);

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