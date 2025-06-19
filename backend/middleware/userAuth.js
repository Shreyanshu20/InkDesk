const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const userAuth = async (req, res, next) => {
    try {
        console.log('🔐 UserAuth middleware - checking authentication');
        console.log('🍪 Cookies received:', req.cookies);

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
        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
        console.log('✅ Token verified successfully. Decoded:', decoded);

        // FIX: Handle both possible ID field names
        const userId = decoded.id || decoded.userId;
        console.log('🆔 Using user ID:', userId);

        const user = await User.findById(userId).select('-password');
        if (!user) {
            console.log('❌ User not found for token');
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }

        // FIX: Set both req.userId and req.user consistently
        req.userId = userId;
        req.user = user;
        
        console.log('✅ User authenticated:', user.email, 'Role:', user.role);
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

// NEW: Admin-only middleware for write operations
const adminOnly = async (req, res, next) => {
    try {
        console.log('🛡️ AdminOnly middleware - checking admin privileges');
        
        if (!req.user) {
            console.log('❌ No user found in request');
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        if (req.user.role !== 'admin') {
            console.log('❌ Access denied. User role:', req.user.role);
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required for this operation.'
            });
        }

        console.log('✅ Admin access granted for:', req.user.email);
        next();

    } catch (error) {
        console.error('❌ Admin check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error checking admin privileges.'
        });
    }
};

// NEW: Admin panel access middleware (allows both admin and user roles)
const adminPanelAuth = async (req, res, next) => {
    try {
        console.log('🏢 AdminPanel auth middleware - checking panel access');
        
        if (!req.user) {
            console.log('❌ No user found in request');
            return res.status(401).json({
                success: false,
                message: 'Authentication required to access admin panel.'
            });
        }

        // Allow both admin and user roles to access admin panel
        if (!['admin', 'user'].includes(req.user.role)) {
            console.log('❌ Invalid role for admin panel:', req.user.role);
            return res.status(403).json({
                success: false,
                message: 'Access denied. Invalid role for admin panel access.'
            });
        }

        console.log('✅ Admin panel access granted for:', req.user.email, 'Role:', req.user.role);
        next();

    } catch (error) {
        console.error('❌ Admin panel auth error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error checking admin panel access.'
        });
    }
};

module.exports = { userAuth, adminOnly, adminPanelAuth };

