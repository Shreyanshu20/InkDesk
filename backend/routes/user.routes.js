const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth.js');
const User = require('../models/User.model.js');
const Address = require('../models/address.model.js');

// Get user addresses
router.get('/addresses', userAuth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('address_details');

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
        console.error('Error fetching addresses:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching addresses'
        });
    }
});

// Add new address
router.post('/addresses', userAuth, async (req, res) => {
    try {
        console.log('📍 POST /addresses called');
        console.log('📍 Request body:', req.body);
        console.log('📍 User ID:', req.userId);

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
            console.log('❌ Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        const user = await User.findById(req.userId);
        console.log('📍 User found:', user ? 'Yes' : 'No');
        console.log('📍 Current address count:', user?.address_details?.length || 0);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // If setting as primary, update existing primary addresses
        if (is_primary && user.address_details.length > 0) {
            console.log('📍 Updating existing primary addresses to false');
            await Address.updateMany(
                { _id: { $in: user.address_details } },
                { is_primary: false }
            );
        }

        // Create new address
        const addressData = {
            first_name,
            last_name,
            phone,
            address_line_1,
            city,
            state,
            postal_code,
            country: country || 'India',
            is_primary: is_primary || user.address_details.length === 0
        };

        console.log('📍 Creating address with data:', addressData);

        const newAddress = new Address(addressData);
        const savedAddress = await newAddress.save();

        console.log('📍 Address saved:', savedAddress._id);

        // Add address to user's address_details array
        user.address_details.push(savedAddress._id);
        const savedUser = await user.save();

        console.log('📍 User updated, new address count:', savedUser.address_details.length);

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

        console.log('📍 PUT /addresses/:addressId called');
        console.log('📍 Address ID:', addressId);
        console.log('📍 User ID:', userId);
        console.log('📍 Update data:', req.body);

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

        console.log('📍 Address updated successfully');

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

        console.log('Delete request - AddressId:', addressId, 'UserId:', userId);

        // Find the user
        const user = await User.findById(userId).populate('address_details');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('User found, address count:', user.address_details.length);

        // Check if address belongs to user
        const addressExists = user.address_details.some(addr => addr._id.toString() === addressId);
        if (!addressExists) {
            return res.status(403).json({
                success: false,
                message: 'Address not found or not authorized'
            });
        }

        console.log('Address exists in user addresses');

        // Find the address to check if it's primary
        const address = await Address.findById(addressId);
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        console.log('Address found, is_primary:', address.is_primary);

        // Remove address from user's address_details array
        user.address_details = user.address_details.filter(
            addr => addr._id.toString() !== addressId
        );

        console.log('Address removed from user array, new count:', user.address_details.length);

        // If deleted address was primary and user has other addresses, 
        // make the first remaining address primary
        if (address.is_primary && user.address_details.length > 0) {
            console.log('Setting new primary address:', user.address_details[0]._id);
            await Address.findByIdAndUpdate(
                user.address_details[0]._id,
                { is_primary: true }
            );
        }

        // Save user and delete address
        await user.save();
        await Address.findByIdAndDelete(addressId);

        console.log('Address deleted successfully');

        res.json({
            success: true,
            message: 'Address deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting address',
            error: error.message
        });
    }
});

module.exports = router;