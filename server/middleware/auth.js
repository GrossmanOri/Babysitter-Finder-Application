const jwt = require('jsonwebtoken');
const config = require('../config/default');
module.exports = function(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'אין טוקן, גישה נדחית'
        });
    }
    try {
        const decoded = jwt.verify(token, config.jwt.secret);
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