const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const config = require('../config/default');
const router = express.Router();
router.post('/register', [
    body('firstName', 'שם פרטי הוא שדה חובה').not().isEmpty(),
    body('lastName', 'שם משפחה הוא שדה חובה').not().isEmpty(),
    body('email', 'אנא הזינו אימייל תקין').isEmail(),
    body('password', 'סיסמה חייבת להיות לפחות 6 תווים').isLength({ min: 6 }),
    body('phone', 'מספר טלפון הוא שדה חובה').not().isEmpty(),
    body('userType', 'סוג משתמש חייב להיות parent או babysitter').isIn(['parent', 'babysitter']),
    body('city', 'עיר היא שדה חובה').not().isEmpty()
], function(req, res) {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
        console.error('Database not connected. ReadyState:', mongoose.connection.readyState);
        return res.status(500).json({
            success: false,
            message: 'Database connection error'
        });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        return res.status(400).json({ 
            success: false,
            message: errorMessages,
            errors: errors.array() 
        });
    }
    console.log('Registration request body:', req.body);
    const { firstName, lastName, email, password, phone, userType, city, experience, hourlyRate, description } = req.body;
    User.findOne({ email: email })
        .then(user => {
            console.log('Existing user check result:', user ? 'User exists' : 'User does not exist');
            if (user) {
                console.log('User already exists with email:', email);
                return res.status(400).json({
                    success: false,
                    message: 'משתמש עם אימייל זה כבר קיים במערכת'
                });
            }
            console.log('Creating new user...');
            const userData = {
                firstName,
                lastName,
                email,
                password,
                phone,
                userType,
                city
            };
            if (userType === 'babysitter') {
                userData.babysitter = {
                    experience: experience,
                    hourlyRate: hourlyRate,
                    description: description
                };
            }
            console.log('User data to save:', userData);
            const newUser = new User(userData);
            newUser.save()
                .then(user => {
                    console.log('User saved successfully:', user.email);
                    const payload = {
                        user: {
                            id: user.id,
                            userType: user.userType
                        }
                    };
                    jwt.sign(
                        payload,
                        config.jwt.secret,
                        { expiresIn: config.jwt.expiresIn },
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
router.post('/login', [
    body('email', 'אנא הזינו אימייל תקין').isEmail(),
    body('password', 'סיסמה היא שדה חובה').exists()
], function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }
    const { email, password } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'פרטי התחברות שגויים'
                });
            }
            if (!user.isActive) {
                return res.status(400).json({
                    success: false,
                    message: 'החשבון אינו פעיל'
                });
            }
            user.comparePassword(password)
                .then(isMatch => {
                    if (!isMatch) {
                        return res.status(400).json({
                            success: false,
                            message: 'פרטי התחברות שגויים'
                        });
                    }
                    user.save()
                        .then(() => {
                            const payload = {
                                user: {
                                    id: user.id,
                                    userType: user.userType
                                }
                            };
                            jwt.sign(
                                payload,
                                config.jwt.secret,
                                { expiresIn: config.jwt.expiresIn },
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
                                            phone: user.phone,
                                            userType: user.userType,
                                            city: user.city,
                                            profileImage: user.profileImage,
                                            babysitter: user.babysitter,
                                            parent: user.parent
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
router.post('/logout', auth, function(req, res) {
    res.json({
        success: true,
        message: 'התנתקת בהצלחה'
    });
});
router.post('/change-password', [
    auth,
    body('currentPassword', 'סיסמה נוכחית היא שדה חובה').exists(),
    body('newPassword', 'סיסמה חדשה חייבת להיות לפחות 6 תווים').isLength({ min: 6 })
], function(req, res) {
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
            user.comparePassword(currentPassword)
                .then(isMatch => {
                    if (!isMatch) {
                        return res.status(400).json({
                            success: false,
                            message: 'סיסמה נוכחית שגויה'
                        });
                    }
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