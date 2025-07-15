const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
    body('firstName', 'שם פרטי הוא שדה חובה').not().isEmpty(),
    body('lastName', 'שם משפחה הוא שדה חובה').not().isEmpty(),
    body('email', 'אנא הזינו אימייל תקין').isEmail(),
    body('password', 'סיסמה חייבת להיות לפחות 6 תווים').isLength({ min: 6 }),
    body('phone', 'מספר טלפון הוא שדה חובה').not().isEmpty(),
    body('userType', 'סוג משתמש חייב להיות parent או babysitter').isIn(['parent', 'babysitter']),
    body('city', 'עיר היא שדה חובה').not().isEmpty()
], function(req, res) {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    const { firstName, lastName, email, password, phone, userType, city, address } = req.body;

    // Check if user already exists
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                return res.status(400).json({
                    success: false,
                    message: 'משתמש עם אימייל זה כבר קיים במערכת'
                });
            }

            // Create new user
            const newUser = new User({
                firstName,
                lastName,
                email,
                password,
                phone,
                userType,
                city,
                address
            });

            // Save user to database
            newUser.save()
                .then(user => {
                    // Create JWT token
                    const payload = {
                        user: {
                            id: user.id,
                            userType: user.userType
                        }
                    };

                    jwt.sign(
                        payload,
                        process.env.JWT_SECRET,
                        { expiresIn: '7d' },
                        function(err, token) {
                            if (err) {
                                console.error('JWT signing error:', err);
                                return res.status(500).json({
                                    success: false,
                                    message: 'שגיאה ביצירת טוקן'
                                });
                            }

                            res.json({
                                success: true,
                                message: 'המשתמש נרשם בהצלחה',
                                token,
                                user: {
                                    id: user.id,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    email: user.email,
                                    userType: user.userType,
                                    city: user.city
                                }
                            });
                        }
                    );
                })
                .catch(err => {
                    console.error('User save error:', err);
                    res.status(500).json({
                        success: false,
                        message: 'שגיאה בשמירת המשתמש'
                    });
                });
        })
        .catch(err => {
            console.error('User find error:', err);
            res.status(500).json({
                success: false,
                message: 'שגיאה בבדיקת המשתמש'
            });
        });
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
    body('email', 'אנא הזינו אימייל תקין').isEmail(),
    body('password', 'סיסמה היא שדה חובה').exists()
], function(req, res) {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    const { email, password } = req.body;

    // Check if user exists
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'פרטי התחברות שגויים'
                });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(400).json({
                    success: false,
                    message: 'החשבון אינו פעיל'
                });
            }

            // Check password
            user.comparePassword(password)
                .then(isMatch => {
                    if (!isMatch) {
                        return res.status(400).json({
                            success: false,
                            message: 'פרטי התחברות שגויים'
                        });
                    }

                    // Update last login
                    user.lastLogin = new Date();
                    user.save()
                        .then(() => {
                            // Create JWT token
                            const payload = {
                                user: {
                                    id: user.id,
                                    userType: user.userType
                                }
                            };

                            jwt.sign(
                                payload,
                                process.env.JWT_SECRET,
                                { expiresIn: '7d' },
                                function(err, token) {
                                    if (err) {
                                        console.error('JWT signing error:', err);
                                        return res.status(500).json({
                                            success: false,
                                            message: 'שגיאה ביצירת טוקן'
                                        });
                                    }

                                    res.json({
                                        success: true,
                                        message: 'התחברת בהצלחה',
                                        token,
                                        user: {
                                            id: user.id,
                                            firstName: user.firstName,
                                            lastName: user.lastName,
                                            email: user.email,
                                            userType: user.userType,
                                            city: user.city,
                                            profileImage: user.profileImage
                                        }
                                    });
                                }
                            );
                        })
                        .catch(err => {
                            console.error('Last login update error:', err);
                            res.status(500).json({
                                success: false,
                                message: 'שגיאה בעדכון זמן התחברות'
                            });
                        });
                })
                .catch(err => {
                    console.error('Password comparison error:', err);
                    res.status(500).json({
                        success: false,
                        message: 'שגיאה בבדיקת סיסמה'
                    });
                });
        })
        .catch(err => {
            console.error('User find error:', err);
            res.status(500).json({
                success: false,
                message: 'שגיאה בבדיקת המשתמש'
            });
        });
});

// @route   GET /api/auth/verify
// @desc    Verify JWT token
// @access  Private
router.get('/verify', auth, function(req, res) {
    User.findById(req.user.id)
        .select('-password')
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'משתמש לא נמצא'
                });
            }

            res.json({
                success: true,
                user: user
            });
        })
        .catch(err => {
            console.error('User find error:', err);
            res.status(500).json({
                success: false,
                message: 'שגיאה בבדיקת המשתמש'
            });
        });
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, function(req, res) {
    res.json({
        success: true,
        message: 'התנתקת בהצלחה'
    });
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', [
    auth,
    body('currentPassword', 'סיסמה נוכחית היא שדה חובה').exists(),
    body('newPassword', 'סיסמה חדשה חייבת להיות לפחות 6 תווים').isLength({ min: 6 })
], function(req, res) {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    const { currentPassword, newPassword } = req.body;

    User.findById(req.user.id)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'משתמש לא נמצא'
                });
            }

            // Check current password
            user.comparePassword(currentPassword)
                .then(isMatch => {
                    if (!isMatch) {
                        return res.status(400).json({
                            success: false,
                            message: 'סיסמה נוכחית שגויה'
                        });
                    }

                    // Update password
                    user.password = newPassword;
                    user.save()
                        .then(() => {
                            res.json({
                                success: true,
                                message: 'סיסמה שונתה בהצלחה'
                            });
                        })
                        .catch(err => {
                            console.error('Password update error:', err);
                            res.status(500).json({
                                success: false,
                                message: 'שגיאה בעדכון סיסמה'
                            });
                        });
                })
                .catch(err => {
                    console.error('Password comparison error:', err);
                    res.status(500).json({
                        success: false,
                        message: 'שגיאה בבדיקת סיסמה'
                    });
                });
        })
        .catch(err => {
            console.error('User find error:', err);
            res.status(500).json({
                success: false,
                message: 'שגיאה בבדיקת המשתמש'
            });
        });
});

module.exports = router; 