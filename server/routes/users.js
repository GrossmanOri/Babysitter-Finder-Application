const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/users/profile - קבלת פרופיל המשתמש הנוכחי
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
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
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאה בטעינת פרופיל'
    });
  }
});

// PUT /api/users/profile - עדכון פרופיל המשתמש הנוכחי
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, city, password, experience, hourlyRate, description, isAvailable } = req.body;
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (city) updateData.city = city;
    
    // Handle babysitter-specific fields
    const user = await User.findById(req.user.id);
    if (user && user.userType === 'babysitter') {
      if (experience) updateData['babysitter.experience'] = experience;
      if (hourlyRate) updateData['babysitter.hourlyRate'] = hourlyRate;
      if (description) updateData['babysitter.description'] = description;
      if (isAvailable !== undefined) updateData['babysitter.isAvailable'] = isAvailable;
    }
    
    // Handle password change
    if (password && password.length >= 6) {
      const bcrypt = require('bcryptjs');
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'משתמש לא נמצא'
      });
    }
    
    res.json({
      success: true,
      message: 'פרופיל עודכן בהצלחה',
      user: updatedUser
    });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({
      success: false,
      message: 'שגיאה בעדכון פרופיל'
    });
  }
});

// GET /api/users/stats - קבלת סטטיסטיקות המשתמש (MOVED BEFORE /:id route)
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // כאן תוכל להוסיף לוגיקה לקבלת סטטיסטיקות אמיתיות
    // כרגע נחזיר נתונים לדוגמה
    const stats = {
      totalMessages: 5,
      totalConversations: 3
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאה בטעינת סטטיסטיקות'
    });
  }
});

// GET /api/users/:id - קבלת פרטי משתמש ספציפי
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    
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
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאה בטעינת פרטי משתמש'
    });
  }
});

// DELETE /api/users/profile - מחיקת החשבון של המשתמש הנוכחי
router.delete('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // מחיקת המשתמש מהמסד הנתונים
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'משתמש לא נמצא'
      });
    }
    
    console.log(`User ${userId} deleted successfully`);
    
    // החזרת הודעת הצלחה עם דגל שמציין שהמשתמש נמחק
    res.json({
      success: true,
      message: 'החשבון נמחק בהצלחה',
      userDeleted: true
    });
  } catch (error) {
    console.error('Error deleting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאה במחיקת החשבון'
    });
  }
});

// GET /api/users - קבלת רשימת משתמשים (למנהלים)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalUsers = await User.countDocuments({});
    const totalPages = Math.ceil(totalUsers / limit);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalUsers,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאה בטעינת משתמשים'
    });
  }
});

// PUT /api/users/:id - עדכון משתמש ספציפי (למנהלים)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, userType, city, isActive } = req.body;
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (userType) updateData.userType = userType;
    if (city) updateData.city = city;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
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
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאה בעדכון משתמש'
    });
  }
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

// Duplicate /stats route removed - moved above /:id route

// PUT /api/users/password - שינוי סיסמה
router.put('/password', auth, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'הסיסמה חייבת להכיל לפחות 6 תווים'
      });
    }
    
    const bcrypt = require('bcryptjs');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    await User.findByIdAndUpdate(req.user.id, {
      password: hashedPassword
    });
    
    res.json({
      success: true,
      message: 'הסיסמה שונתה בהצלחה'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאה בשינוי סיסמה'
    });
  }
});

module.exports = router; 