const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/default');

module.exports = async function(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'אין טוקן, גישה נדחית'
        });
    }
    
    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        
        // בדיקה שהמשתמש עדיין קיים במסד הנתונים
        const user = await User.findById(decoded.user.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'המשתמש לא קיים במערכת'
            });
        }
        
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