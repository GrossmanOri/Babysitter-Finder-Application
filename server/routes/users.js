const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/users/profile - קבלת פרופיל המשתמש הנוכחי
router.get('/profile', auth, (req, res) => {
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
        data: user
      });
    })
    .catch(err => {
      console.error('Error fetching user profile:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה בטעינת פרופיל משתמש'
      });
    });
});

// PUT /api/users/profile - עדכון פרופיל המשתמש הנוכחי
router.put('/profile', auth, (req, res) => {
  const { firstName, lastName, phone, city } = req.body;
  const updateFields = {};
  
  // הוספת שדות לעדכון רק אם הם קיימים
  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  if (phone) updateFields.phone = phone;
  if (city) updateFields.city = city;
  
  // עדכון פרטים ספציפיים לפי סוג משתמש
  if (req.user.userType === 'babysitter') {
    const { age, experience, hourlyRate, description, isAvailable } = req.body;
    if (age !== undefined) updateFields['babysitter.age'] = age;
    if (experience) updateFields['babysitter.experience'] = experience;
    if (hourlyRate !== undefined) updateFields['babysitter.hourlyRate'] = hourlyRate;
    if (description !== undefined) updateFields['babysitter.description'] = description;
    if (isAvailable !== undefined) updateFields['babysitter.isAvailable'] = isAvailable;
  } else if (req.user.userType === 'parent') {
    const { childrenCount, childrenAges } = req.body;
    if (childrenCount !== undefined) updateFields['parent.childrenCount'] = childrenCount;
    if (childrenAges) updateFields['parent.childrenAges'] = childrenAges;
  }
  
  User.findByIdAndUpdate(
    req.user.id,
    { $set: updateFields },
    { new: true, runValidators: true }
  )
    .select('-password')
    .then(updatedUser => {
      res.json({
        success: true,
        message: 'פרופיל עודכן בהצלחה',
        data: updatedUser
      });
    })
    .catch(err => {
      console.error('Error updating user profile:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה בעדכון פרופיל'
      });
    });
});

// GET /api/users/:id - קבלת פרטי משתמש ספציפי
router.get('/:id', auth, (req, res) => {
  const { id } = req.params;
  
  User.findById(id)
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
        data: user
      });
    })
    .catch(err => {
      console.error('Error fetching user:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה בטעינת פרטי משתמש'
      });
    });
});

// DELETE /api/users/profile - מחיקת החשבון של המשתמש הנוכחי
router.delete('/profile', auth, (req, res) => {
  User.findByIdAndDelete(req.user.id)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'משתמש לא נמצא'
        });
      }
      
      res.json({
        success: true,
        message: 'החשבון נמחק בהצלחה'
      });
    })
    .catch(err => {
      console.error('Error deleting user:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה במחיקת החשבון'
      });
    });
});

// GET /api/users - קבלת רשימת משתמשים (למנהלים)
router.get('/', auth, (req, res) => {
  // בדיקה שהמשתמש הוא מנהל (אופציונלי)
  const { userType, city, limit = 10, page = 1 } = req.query;
  
  const filter = {};
  if (userType) filter.userType = userType;
  if (city) filter.city = city;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .then(users => {
      User.countDocuments(filter)
        .then(total => {
          res.json({
            success: true,
            data: users,
            pagination: {
              currentPage: parseInt(page),
              totalPages: Math.ceil(total / parseInt(limit)),
              totalItems: total,
              itemsPerPage: parseInt(limit)
            }
          });
        });
    })
    .catch(err => {
      console.error('Error fetching users:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה בטעינת משתמשים'
      });
    });
});

// PUT /api/users/:id - עדכון משתמש ספציפי (למנהלים)
router.put('/:id', auth, (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, userType, city, isActive } = req.body;
  
  const updateFields = {};
  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  if (email) updateFields.email = email;
  if (phone) updateFields.phone = phone;
  if (userType) updateFields.userType = userType;
  if (city) updateFields.city = city;
  if (isActive !== undefined) updateFields.isActive = isActive;
  
  User.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true, runValidators: true }
  )
    .select('-password')
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'משתמש לא נמצא'
        });
      }
      
      res.json({
        success: true,
        message: 'משתמש עודכן בהצלחה',
        data: updatedUser
      });
    })
    .catch(err => {
      console.error('Error updating user:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה בעדכון משתמש'
      });
    });
});

// DELETE /api/users/:id - מחיקת משתמש ספציפי (למנהלים)
router.delete('/:id', auth, (req, res) => {
  const { id } = req.params;
  
  User.findByIdAndDelete(id)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'משתמש לא נמצא'
        });
      }
      
      res.json({
        success: true,
        message: 'משתמש נמחק בהצלחה'
      });
    })
    .catch(err => {
      console.error('Error deleting user:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה במחיקת משתמש'
      });
    });
});

module.exports = router; 