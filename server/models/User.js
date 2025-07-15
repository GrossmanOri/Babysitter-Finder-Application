const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // פרטי משתמש בסיסיים
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  
  // סוג משתמש
  userType: {
    type: String,
    enum: ['parent', 'babysitter'],
    required: true
  },
  
  // פרטים נוספים לביביסיטר
  babysitter: {
    age: {
      type: Number,
      min: 16,
      max: 80
    },
    experience: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert']
    },
    hourlyRate: {
      type: Number,
      min: 20,
      max: 200
    },
    city: {
      type: String,
      required: true
    },
    description: {
      type: String,
      maxlength: 500
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  
  // פרטים נוספים להורה
  parent: {
    childrenCount: {
      type: Number,
      min: 1,
      max: 10
    },
    childrenAges: [{
      type: Number,
      min: 0,
      max: 18
    }],
    city: {
      type: String,
      required: true
    }
  },
  
  // תאריכי יצירה ועדכון
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware לעדכון תאריך עדכון
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// הצפנת סיסמה לפני שמירה
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  
  bcrypt.hash(this.password, 12)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(err => next(err));
});

// פונקציה להשוואת סיסמאות
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// פונקציה לקבלת פרטי משתמש ללא סיסמה
userSchema.methods.toPublicJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema); 