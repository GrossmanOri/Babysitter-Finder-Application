const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Booking Details
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Parent is required']
  },
  babysitter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Babysitter is required']
  },
  
  // Date and Time
  date: {
    type: Date,
    required: [true, 'Booking date is required'],
    min: [new Date(), 'Booking date cannot be in the past']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  
  // Duration and Cost
  duration: {
    type: Number, // in hours
    required: [true, 'Duration is required'],
    min: [0.5, 'Minimum booking duration is 30 minutes'],
    max: [24, 'Maximum booking duration is 24 hours']
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Hourly rate is required'],
    min: [0, 'Hourly rate cannot be negative']
  },
  totalCost: {
    type: Number,
    required: [true, 'Total cost is required'],
    min: [0, 'Total cost cannot be negative']
  },
  
  // Location
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  
  // Children Information
  children: [{
    age: {
      type: Number,
      min: [0, 'Child age cannot be negative']
    },
    specialNeeds: {
      type: String,
      trim: true
    }
  }],
  
  // Special Requirements
  specialRequirements: {
    type: String,
    maxlength: [500, 'Special requirements cannot exceed 500 characters'],
    trim: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  
  // Cancellation
  cancelledBy: {
    type: String,
    enum: ['parent', 'babysitter', 'system'],
    default: null
  },
  cancellationReason: {
    type: String,
    maxlength: [300, 'Cancellation reason cannot exceed 300 characters'],
    trim: true
  },
  
  // Review
  review: {
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot exceed 500 characters'],
      trim: true
    },
    createdAt: {
      type: Date,
      default: null
    }
  },
  
  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  
  // Notes
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ parent: 1, date: -1 });
bookingSchema.index({ babysitter: 1, date: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ date: 1, status: 1 });

// Virtual for formatted date
bookingSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('he-IL');
});

// Virtual for formatted time range
bookingSchema.virtual('timeRange').get(function() {
  return `${this.startTime} - ${this.endTime}`;
});

// Pre-save middleware to calculate total cost
bookingSchema.pre('save', function(next) {
  if (this.isModified('duration') || this.isModified('hourlyRate')) {
    this.totalCost = this.duration * this.hourlyRate;
  }
  next();
});

// Method to check if booking is in the past
bookingSchema.methods.isPast = function() {
  const now = new Date();
  const bookingDateTime = new Date(this.date);
  bookingDateTime.setHours(parseInt(this.startTime.split(':')[0]));
  bookingDateTime.setMinutes(parseInt(this.startTime.split(':')[1]));
  return bookingDateTime < now;
};

// Method to check if booking is today
bookingSchema.methods.isToday = function() {
  const today = new Date();
  const bookingDate = new Date(this.date);
  return today.toDateString() === bookingDate.toDateString();
};

// Method to check if booking is upcoming
bookingSchema.methods.isUpcoming = function() {
  return !this.isPast() && this.status === 'confirmed';
};

module.exports = mongoose.model('Booking', bookingSchema); 