const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // שולח ההודעה
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // מקבל ההודעה
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // תוכן ההודעה
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  
  // סטטוס ההודעה
  isRead: {
    type: Boolean,
    default: false
  },
  
  // תאריך יצירה
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// אינדקסים לביצועים טובים יותר
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ isRead: 1 });

// פונקציה לקבלת הודעות בין שני משתמשים
messageSchema.statics.getConversation = function(user1Id, user2Id, limit = 50) {
  return this.find({
    $or: [
      { sender: user1Id, receiver: user2Id },
      { sender: user2Id, receiver: user1Id }
    ]
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('sender', 'firstName lastName userType')
  .populate('receiver', 'firstName lastName userType');
};

// פונקציה לסימון הודעות כנקראו
messageSchema.statics.markAsRead = function(senderId, receiverId) {
  return this.updateMany(
    { sender: senderId, receiver: receiverId, isRead: false },
    { isRead: true }
  );
};

// פונקציה לקבלת רשימת שיחות של משתמש
messageSchema.statics.getConversations = function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { sender: mongoose.Types.ObjectId(userId) },
          { receiver: mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$sender', mongoose.Types.ObjectId(userId)] },
            '$receiver',
            '$sender'
          ]
        },
        lastMessage: { $last: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              { 
                $and: [
                  { $eq: ['$receiver', mongoose.Types.ObjectId(userId)] },
                  { $eq: ['$isRead', false] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    }
  ]);
};

module.exports = mongoose.model('Message', messageSchema); 