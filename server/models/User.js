const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
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
  profileImage: {
    type: String
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  userType: {
    type: String,
    enum: ['parent', 'babysitter'],
    required: true
  },
  babysitter: {
    experience: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert']
    },
    hourlyRate: {
      type: Number,
      min: 20,
      max: 200
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
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
userSchema.index({ email: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ city: 1 });
userSchema.index({ 'babysitter.isAvailable': 1 });
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
      next();
  } catch (error) {
    next(error);
  }
});
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.methods.getBabysitterDetails = function() {
  if (this.userType !== 'babysitter') {
    return null;
  }
  return {
    experience: this.babysitter?.experience,
    hourlyRate: this.babysitter?.hourlyRate,
    description: this.babysitter?.description,
    isAvailable: this.babysitter?.isAvailable
  };
};
userSchema.statics.findAvailableBabysitters = function(city = null) {
  const query = {
    userType: 'babysitter',
    isActive: true,
    'babysitter.isAvailable': true
  };
  if (city) {
    query.city = city;
  }
  return this.find(query);
};
userSchema.statics.searchUsers = function(searchTerm, userType = null) {
  const query = {
    isActive: true,
    $or: [
      { firstName: { $regex: searchTerm, $options: 'i' } },
      { lastName: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } }
    ]
  };
  if (userType) {
    query.userType = userType;
  }
  return this.find(query);
};
module.exports = mongoose.model('User', userSchema); 