const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

module.exports.userAuth = async (req, res, next) => {
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
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
        const userId = decoded.id || decoded.userId;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }

        req.userId = userId;
        req.user = user;
        next();

    } catch (error) {
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

module.exports.adminOnly = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required for this operation.'
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error checking admin privileges.'
        });
    }
};

module.exports.adminPanelAuth = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required to access admin panel.'
            });
        }

        if (!['admin', 'user'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Invalid role for admin panel access.'
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error checking admin panel access.'
        });
    }
};
