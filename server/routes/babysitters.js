const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
router.get('/', (req, res) => {
  const { city, experience, maxRate } = req.query;
  const filter = {
    userType: 'babysitter',
    'babysitter.isAvailable': true
  };
  if (city) {
    filter.city = { $regex: city, $options: 'i' };
  }
  if (experience) {
    filter['babysitter.experience'] = experience;
  }
  if (maxRate) {
    filter['babysitter.hourlyRate'] = { $lte: parseInt(maxRate) };
  }
  User.find(filter)
    .select('firstName lastName city babysitter')
    .sort({ 'babysitter.hourlyRate': 1 })
    .then(babysitters => {
      const processedBabysitters = babysitters.map(babysitter => {
        const babysitterData = babysitter.toObject();
        if (!babysitterData.city && babysitterData.babysitter?.city) {
          babysitterData.city = babysitterData.babysitter.city;
        }
        return babysitterData;
      });
      res.json({
        success: true,
        data: processedBabysitters,
        count: processedBabysitters.length
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
module.exports = router; 