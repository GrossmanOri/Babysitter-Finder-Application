const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking (parents only)
// @access  Private
router.post('/', [
    auth,
    body('babysitterId', 'ID בייביסיטר הוא שדה חובה').isMongoId(),
    body('date', 'תאריך הוא שדה חובה').isISO8601(),
    body('startTime', 'שעת התחלה היא שדה חובה').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('endTime', 'שעת סיום היא שדה חובה').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('location', 'מיקום הוא שדה חובה').not().isEmpty(),
    body('children').optional().isArray(),
    body('specialRequirements').optional().isLength({ max: 500 })
], function(req, res) {
    // Check if user is parent
    if (req.user.userType !== 'parent') {
        return res.status(403).json({
            success: false,
            message: 'גישה נדחית - רק הורים יכולים ליצור הזמנות'
        });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    const {
        babysitterId,
        date,
        startTime,
        endTime,
        location,
        children,
        specialRequirements
    } = req.body;

    // Check if babysitter exists and is active
    User.findById(babysitterId)
        .then(babysitter => {
            if (!babysitter) {
                return res.status(404).json({
                    success: false,
                    message: 'בייביסיטר לא נמצא'
                });
            }

            if (babysitter.userType !== 'babysitter') {
                return res.status(400).json({
                    success: false,
                    message: 'המשתמש אינו בייביסיטר'
                });
            }

            if (!babysitter.isActive) {
                return res.status(400).json({
                    success: false,
                    message: 'הבייביסיטר אינו פעיל'
                });
            }

            // Calculate duration in hours
            const start = new Date(`2000-01-01T${startTime}:00`);
            const end = new Date(`2000-01-01T${endTime}:00`);
            const duration = (end - start) / (1000 * 60 * 60); // Convert to hours

            if (duration <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'שעת סיום חייבת להיות מאוחרת משעת התחלה'
                });
            }

            // Check if date is in the future
            const bookingDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (bookingDate < today) {
                return res.status(400).json({
                    success: false,
                    message: 'לא ניתן להזמין לתאריך בעבר'
                });
            }

            // Calculate total cost
            const hourlyRate = babysitter.babysitterProfile.hourlyRate || 0;
            const totalCost = duration * hourlyRate;

            // Create new booking
            const newBooking = new Booking({
                parent: req.user.id,
                babysitter: babysitterId,
                date: bookingDate,
                startTime,
                endTime,
                duration,
                hourlyRate,
                totalCost,
                location,
                children: children || [],
                specialRequirements
            });

            // Save booking
            newBooking.save()
                .then(booking => {
                    // Populate user details
                    return booking.populate([
                        { path: 'parent', select: 'firstName lastName email phone' },
                        { path: 'babysitter', select: 'firstName lastName email phone babysitterProfile.hourlyRate' }
                    ]);
                })
                .then(populatedBooking => {
                    res.status(201).json({
                        success: true,
                        message: 'הזמנה נוצרה בהצלחה',
                        data: populatedBooking
                    });
                })
                .catch(err => {
                    console.error('Booking save error:', err);
                    res.status(500).json({
                        success: false,
                        message: 'שגיאה ביצירת הזמנה'
                    });
                });
        })
        .catch(err => {
            console.error('Babysitter find error:', err);
            res.status(500).json({
                success: false,
                message: 'שגיאה בבדיקת בייביסיטר'
            });
        });
});

// @route   GET /api/bookings
// @desc    Get user's bookings (parent or babysitter)
// @access  Private
router.get('/', auth, function(req, res) {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build filter based on user type
    const filter = {};
    if (req.user.userType === 'parent') {
        filter.parent = req.user.id;
    } else if (req.user.userType === 'babysitter') {
        filter.babysitter = req.user.id;
    }

    // Add status filter if provided
    if (status) {
        filter.status = status;
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    Booking.find(filter)
        .populate('parent', 'firstName lastName email phone')
        .populate('babysitter', 'firstName lastName email phone babysitterProfile.hourlyRate')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .then(bookings => {
            // Get total count for pagination
            Booking.countDocuments(filter)
                .then(total => {
                    res.json({
                        success: true,
                        data: bookings,
                        pagination: {
                            currentPage: parseInt(page),
                            totalPages: Math.ceil(total / parseInt(limit)),
                            totalItems: total,
                            itemsPerPage: parseInt(limit)
                        }
                    });
                })
                .catch(err => {
                    console.error('Count error:', err);
                    res.status(500).json({
                        success: false,
                        message: 'שגיאה בספירת הזמנות'
                    });
                });
        })
        .catch(err => {
            console.error('Bookings find error:', err);
            res.status(500).json({
                success: false,
                message: 'שגיאה בקבלת הזמנות'
            });
        });
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, function(req, res) {
    Booking.findById(req.params.id)
        .populate('parent', 'firstName lastName email phone')
        .populate('babysitter', 'firstName lastName email phone babysitterProfile')
        .then(booking => {
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'הזמנה לא נמצאה'
                });
            }

            // Check if user has access to this booking
            if (booking.parent.toString() !== req.user.id && 
                booking.babysitter.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'אין לך הרשאה לצפות בהזמנה זו'
                });
            }

            res.json({
                success: true,
                data: booking
            });
        })
        .catch(err => {
            console.error('Booking find error:', err);
            if (err.kind === 'ObjectId') {
                return res.status(404).json({
                    success: false,
                    message: 'הזמנה לא נמצאה'
                });
            }
            res.status(500).json({
                success: false,
                message: 'שגיאה בקבלת פרטי הזמנה'
            });
        });
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (confirm/reject/cancel/complete)
// @access  Private
router.put('/:id/status', [
    auth,
    body('status', 'סטטוס חייב להיות אחד מהערכים: confirmed, rejected, cancelled, completed').isIn(['confirmed', 'rejected', 'cancelled', 'completed']),
    body('reason').optional().isLength({ max: 300 })
], function(req, res) {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    const { status, reason } = req.body;
    const bookingId = req.params.id;

    Booking.findById(bookingId)
        .then(booking => {
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'הזמנה לא נמצאה'
                });
            }

            // Check if user has permission to update this booking
            const isParent = booking.parent.toString() === req.user.id;
            const isBabysitter = booking.babysitter.toString() === req.user.id;

            if (!isParent && !isBabysitter) {
                return res.status(403).json({
                    success: false,
                    message: 'אין לך הרשאה לעדכן הזמנה זו'
                });
            }

            // Check if status change is allowed
            const allowedStatusChanges = {
                parent: {
                    pending: ['cancelled'],
                    confirmed: ['cancelled']
                },
                babysitter: {
                    pending: ['confirmed', 'rejected']
                }
            };

            const userType = isParent ? 'parent' : 'babysitter';
            const allowedChanges = allowedStatusChanges[userType][booking.status] || [];

            if (!allowedChanges.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `לא ניתן לשנות סטטוס מ-${booking.status} ל-${status}`
                });
            }

            // Update booking
            const updateFields = { status };
            if (reason) {
                updateFields.cancellationReason = reason;
            }
            if (status === 'cancelled' || status === 'rejected') {
                updateFields.cancelledBy = userType;
            }

            Booking.findByIdAndUpdate(
                bookingId,
                { $set: updateFields },
                { new: true }
            )
                .populate('parent', 'firstName lastName email phone')
                .populate('babysitter', 'firstName lastName email phone')
                .then(updatedBooking => {
                    res.json({
                        success: true,
                        message: 'סטטוס הזמנה עודכן בהצלחה',
                        data: updatedBooking
                    });
                })
                .catch(err => {
                    console.error('Booking update error:', err);
                    res.status(500).json({
                        success: false,
                        message: 'שגיאה בעדכון סטטוס הזמנה'
                    });
                });
        })
        .catch(err => {
            console.error('Booking find error:', err);
            res.status(500).json({
                success: false,
                message: 'שגיאה בבדיקת הזמנה'
            });
        });
});

// @route   POST /api/bookings/:id/review
// @desc    Add review to completed booking (parents only)
// @access  Private
router.post('/:id/review', [
    auth,
    body('rating', 'דירוג חייב להיות בין 1 ל-5').isFloat({ min: 1, max: 5 }),
    body('comment').optional().isLength({ max: 500 })
], function(req, res) {
    // Check if user is parent
    if (req.user.userType !== 'parent') {
        return res.status(403).json({
            success: false,
            message: 'גישה נדחית - רק הורים יכולים להוסיף ביקורות'
        });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    const { rating, comment } = req.body;
    const bookingId = req.params.id;

    Booking.findById(bookingId)
        .then(booking => {
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'הזמנה לא נמצאה'
                });
            }

            // Check if booking belongs to this parent
            if (booking.parent.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'אין לך הרשאה להוסיף ביקורת להזמנה זו'
                });
            }

            // Check if booking is completed
            if (booking.status !== 'completed') {
                return res.status(400).json({
                    success: false,
                    message: 'ניתן להוסיף ביקורת רק להזמנות שהושלמו'
                });
            }

            // Check if review already exists
            if (booking.review.rating) {
                return res.status(400).json({
                    success: false,
                    message: 'כבר הוספת ביקורת להזמנה זו'
                });
            }

            // Update booking with review
            booking.review = {
                rating,
                comment,
                createdAt: new Date()
            };

            booking.save()
                .then(updatedBooking => {
                    // Update babysitter's average rating
                    return User.findById(booking.babysitter);
                })
                .then(babysitter => {
                    if (!babysitter) {
                        throw new Error('Babysitter not found');
                    }

                    // Calculate new average rating
                    const currentRating = babysitter.babysitterProfile.rating || 0;
                    const currentCount = babysitter.babysitterProfile.reviewCount || 0;
                    const newCount = currentCount + 1;
                    const newRating = ((currentRating * currentCount) + rating) / newCount;

                    // Update babysitter rating
                    return User.findByIdAndUpdate(
                        booking.babysitter,
                        {
                            $set: {
                                'babysitterProfile.rating': newRating,
                                'babysitterProfile.reviewCount': newCount
                            }
                        },
                        { new: true }
                    );
                })
                .then(updatedBabysitter => {
                    res.json({
                        success: true,
                        message: 'ביקורת נוספה בהצלחה',
                        data: {
                            booking: updatedBooking,
                            babysitterRating: updatedBabysitter.babysitterProfile.rating
                        }
                    });
                })
                .catch(err => {
                    console.error('Review save error:', err);
                    res.status(500).json({
                        success: false,
                        message: 'שגיאה בשמירת ביקורת'
                    });
                });
        })
        .catch(err => {
            console.error('Booking find error:', err);
            res.status(500).json({
                success: false,
                message: 'שגיאה בבדיקת הזמנה'
            });
        });
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel booking (only if pending)
// @access  Private
router.delete('/:id', auth, function(req, res) {
    Booking.findById(req.params.id)
        .then(booking => {
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'הזמנה לא נמצאה'
                });
            }

            // Check if user has permission to cancel this booking
            const isParent = booking.parent.toString() === req.user.id;
            const isBabysitter = booking.babysitter.toString() === req.user.id;

            if (!isParent && !isBabysitter) {
                return res.status(403).json({
                    success: false,
                    message: 'אין לך הרשאה לבטל הזמנה זו'
                });
            }

            // Check if booking can be cancelled
            if (booking.status !== 'pending') {
                return res.status(400).json({
                    success: false,
                    message: 'ניתן לבטל רק הזמנות ממתינות'
                });
            }

            // Cancel booking
            booking.status = 'cancelled';
            booking.cancelledBy = isParent ? 'parent' : 'babysitter';
            booking.cancellationReason = 'בוטל על ידי המשתמש';

            booking.save()
                .then(() => {
                    res.json({
                        success: true,
                        message: 'הזמנה בוטלה בהצלחה'
                    });
                })
                .catch(err => {
                    console.error('Booking cancellation error:', err);
                    res.status(500).json({
                        success: false,
                        message: 'שגיאה בביטול הזמנה'
                    });
                });
        })
        .catch(err => {
            console.error('Booking find error:', err);
            res.status(500).json({
                success: false,
                message: 'שגיאה בבדיקת הזמנה'
            });
        });
});

module.exports = router; 