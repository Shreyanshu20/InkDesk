const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const userAuth = async (req, res, next) => {
    try {
        console.log('🔐 UserAuth middleware called');
        console.log('🍪 All cookies:', req.cookies);
        
        // Check for both possible cookie names
        const token = req.cookies.userToken || req.cookies.token;
        
        if (!token) {
            console.log('❌ No token provided in cookies');
            return res.status(401).json({
                success: false,
                message: 'Access denied. Please login to continue.'
            });
        }

        console.log('🎫 Token found, verifying...');
        
        // Check if JWT_SECRET_USER is defined
        if (!process.env.JWT_SECRET_USER) {
            console.error('❌ JWT_SECRET_USER not defined');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
        console.log('✅ Token decoded successfully:', decoded);
        
        // Handle both possible user ID field names
        const userId = decoded.userId || decoded.id;
        req.userId = userId;
        
        // Optional: Verify user still exists
        const user = await User.findById(userId);
        if (!user) {
            console.log('❌ User not found in database');
            return res.status(401).json({
                success: false,
                message: 'User not found. Please login again.'
            });
        }
        
        console.log('✅ User authenticated:', user.email);
        next();
        
    } catch (error) {
        console.error('❌ Token verification failed:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again.'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Authentication failed. Please login again.'
        });
    }
};

module.exports = { userAuth };

