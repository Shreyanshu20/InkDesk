const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const userAuth = async (req, res, next) => {
    try {
        console.log('🔐 UserAuth middleware - checking authentication');
        console.log('🍪 Cookies received:', req.cookies);

        // Get token from cookies or Authorization header
        let token = req.cookies.userToken || req.cookies.token;

        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
                console.log('🎫 Found token in Authorization header');
            }
        }

        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        console.log('🎫 Verifying token...');
        // FIXED: Use JWT_SECRET_USER from .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
        console.log('✅ Token verified successfully. User ID:', decoded.id);

        // Find user and attach to request
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            console.log('❌ User not found for token');
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }

        // Attach user info to request
        req.userId = decoded.id;
        req.user = user;
        
        console.log('✅ User authenticated:', user.email);
        next();

    } catch (error) {
        console.error('❌ Auth middleware error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error verifying token.'
        });
    }
};

module.exports = { userAuth };

