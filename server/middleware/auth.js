const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if no token
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'אין טוקן, גישה נדחית'
        });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({
            success: false,
            message: 'טוקן לא תקין'
        });
    }
}; 