const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/babysitters - חיפוש ביביסיטרים
router.get('/', (req, res) => {
  const { city, experience, maxRate, minAge, maxAge } = req.query;
  
  // בניית פילטר חיפוש
  const filter = {
    userType: 'babysitter',
    'babysitter.isAvailable': true
  };
  
  // פילטר לפי עיר
  if (city) {
    filter['babysitter.city'] = { $regex: city, $options: 'i' };
  }
  
  // פילטר לפי ניסיון
  if (experience) {
    filter['babysitter.experience'] = experience;
  }
  
  // פילטר לפי מחיר מקסימלי
  if (maxRate) {
    filter['babysitter.hourlyRate'] = { $lte: parseInt(maxRate) };
  }
  
  // פילטר לפי גיל
  if (minAge || maxAge) {
    filter['babysitter.age'] = {};
    if (minAge) filter['babysitter.age'].$gte = parseInt(minAge);
    if (maxAge) filter['babysitter.age'].$lte = parseInt(maxAge);
  }
  
  User.find(filter)
    .select('firstName lastName babysitter')
    .sort({ 'babysitter.hourlyRate': 1 })
    .then(babysitters => {
      res.json({
        success: true,
        data: babysitters,
        count: babysitters.length
      });
    })
    .catch(err => {
      console.error('Error fetching babysitters:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה בטעינת ביביסיטרים'
      });
    });
});

// GET /api/babysitters/:id - קבלת פרטי ביביסיטר ספציפי
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  User.findById(id)
    .select('-password')
    .then(babysitter => {
      if (!babysitter) {
        return res.status(404).json({
          success: false,
          message: 'ביביסיטר לא נמצא'
        });
      }
      
      if (babysitter.userType !== 'babysitter') {
        return res.status(400).json({
          success: false,
          message: 'המשתמש אינו ביביסיטר'
        });
      }
      
      res.json({
        success: true,
        data: babysitter
      });
    })
    .catch(err => {
      console.error('Error fetching babysitter:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה בטעינת פרטי ביביסיטר'
      });
    });
});

// GET /api/babysitters/cities/list - רשימת ערים זמינות
router.get('/cities/list', (req, res) => {
  User.distinct('babysitter.city', { userType: 'babysitter' })
    .then(cities => {
      res.json({
        success: true,
        data: cities.filter(city => city).sort()
      });
    })
    .catch(err => {
      console.error('Error fetching cities:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה בטעינת רשימת ערים'
      });
    });
});

module.exports = router; 