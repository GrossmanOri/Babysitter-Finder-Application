const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ isRead: 1 });
messageSchema.statics.getConversation = function(user1Id, user2Id, limit = 50) {
  return this.find({
    $or: [
      { sender: user1Id, receiver: user2Id },
      { sender: user2Id, receiver: user1Id }
    ]
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};
messageSchema.statics.markAsRead = function(senderId, receiverId) {
  return this.updateMany(
    { sender: senderId, receiver: receiverId, isRead: false },
    { isRead: true }
  );
};
messageSchema.statics.getConversations = function(userId) {
  return this.find({
        $or: [
      { sender: userId },
      { receiver: userId }
    ]
  })
  .sort({ createdAt: -1 })
  .then(messages => {
    if (!messages || messages.length === 0) {
      return [];
    }
    const conversations = {};
    messages.forEach(message => {
      const senderId = message.sender;
      const receiverId = message.receiver;
      const otherUserId = senderId === userId ? receiverId : senderId;
      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          _id: otherUserId,
          lastMessage: message,
          unreadCount: 0
        };
      }
      if (receiverId === userId && !message.isRead) {
        conversations[otherUserId].unreadCount++;
      }
    });
    return Object.values(conversations).sort((a, b) => 
      new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );
  });
};
module.exports = mongoose.model('Message', messageSchema); 