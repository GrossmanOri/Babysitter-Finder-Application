const express = require('express');
const router = express.Router();
const User = require('../models/User');
const messageStore = require('../utils/messageStore');
const auth = require('../middleware/auth');
router.post('/', auth, (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user.id;
  console.log('POST /api/messages - Request body:', req.body);
  console.log('POST /api/messages - User:', req.user);
  console.log('POST /api/messages - SenderId:', senderId);
  console.log('POST /api/messages - ReceiverId:', receiverId);
  console.log('POST /api/messages - Content:', content);
  if (!receiverId || !content) {
    console.log('POST /api/messages - Missing receiverId or content');
    return res.status(400).json({
      success: false,
      message: 'נדרשים מזהה מקבל ותוכן הודעה'
    });
  }
  if (content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'תוכן ההודעה לא יכול להיות ריק'
    });
  }
  if (senderId === receiverId) {
    return res.status(400).json({
      success: false,
      message: 'לא ניתן לשלוח הודעה לעצמך'
    });
  }
  const newMessage = messageStore.addMessage(senderId, receiverId, content.trim());
  res.status(201).json({
    success: true,
    message: 'הודעה נשלחה בהצלחה',
    data: {
      _id: newMessage.id,
      sender: senderId,
      receiver: receiverId,
      content: newMessage.content,
      isRead: newMessage.isRead,
      createdAt: newMessage.createdAt
    }
  });
});
router.get('/conversation/:userId', auth, async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;
  const { limit = 50 } = req.query;
  console.log('GET /api/messages/conversation/:userId - CurrentUserId:', currentUserId);
  console.log('GET /api/messages/conversation/:userId - UserId:', userId);
  try {
    const messages = messageStore.getConversation(currentUserId, userId, parseInt(limit));
    messageStore.markAsRead(userId, currentUserId);
    const currentUser = await User.findById(currentUserId).select('firstName lastName userType');
    const otherUser = await User.findById(userId).select('firstName lastName userType');
    const messagesWithSender = messages.map(message => {
      if (message.senderId === currentUserId) {
        return {
          ...message,
          sender: {
            _id: message.senderId,
            firstName: currentUser?.firstName || 'אני',
            lastName: currentUser?.lastName || '',
            userType: currentUser?.userType || 'unknown'
          }
        };
      } else {
        return {
          ...message,
          sender: {
            _id: message.senderId,
            firstName: otherUser?.firstName || 'משתמש',
            lastName: otherUser?.lastName || 'לא ידוע',
            userType: otherUser?.userType || 'unknown'
          }
        };
      }
    });
    res.json({
      success: true,
      data: messagesWithSender
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאה בטעינת שיחה'
    });
  }
});
router.delete('/conversation/:userId', auth, async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;
  console.log('DELETE /api/messages/conversation/:userId - CurrentUserId:', currentUserId);
  console.log('DELETE /api/messages/conversation/:userId - UserId:', userId);
  try {
    const deletedCount = messageStore.deleteConversation(currentUserId, userId);
    console.log('Deleted messages count:', deletedCount);
    res.json({
      success: true,
      message: 'השיחה נמחקה בהצלחה',
      deletedCount: deletedCount
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאה במחיקת שיחה'
    });
  }
});
router.get('/conversations', auth, async (req, res) => {
  const currentUserId = req.user.id;
  console.log('GET /api/messages/conversations - CurrentUserId:', currentUserId);
  try {
    const conversations = messageStore.getConversations(currentUserId);
    console.log('Conversations from messageStore:', conversations);
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conversation) => {
        console.log('Processing conversation:', conversation);
        try {
          const otherUser = await User.findById(conversation._id).select('firstName lastName userType');
          console.log('Found user for conversation:', otherUser);
          return {
            ...conversation,
            user: {
              _id: conversation._id,
              firstName: otherUser?.firstName || 'משתמש',
              lastName: otherUser?.lastName || 'לא ידוע',
              userType: otherUser?.userType || 'unknown'
            }
          };
        } catch (userError) {
          console.error('Error fetching user for conversation:', conversation._id, userError);
          return {
            ...conversation,
            user: {
              _id: conversation._id,
              firstName: 'משתמש',
              lastName: 'לא ידוע',
              userType: 'unknown'
            }
          };
        }
      })
    );
    console.log('Final conversations with users:', conversationsWithUsers);
    res.json({
      success: true,
      data: conversationsWithUsers
    });
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({
      success: false,
      message: 'שגיאה בטעינת שיחות'
    });
  }
});
router.get('/debug/conversations', auth, async (req, res) => {
  const currentUserId = req.user.id;
  console.log('DEBUG: Current user ID:', currentUserId);
  try {
    const messages = require('../utils/messageStore').readMessages();
    console.log('DEBUG: All messages:', messages);
    const conversations = require('../utils/messageStore').getConversations(currentUserId);
    console.log('DEBUG: Conversations for user:', currentUserId, conversations);
    res.json({
      success: true,
      currentUserId,
      totalMessages: messages.length,
      conversations: conversations.map(c => ({
        otherUserId: c._id,
        lastMessageTime: c.lastMessage.createdAt,
        lastMessageContent: c.lastMessage.content,
        unreadCount: c.unreadCount
      }))
    });
  } catch (err) {
    console.error('DEBUG Error:', err);
    res.status(500).json({
      success: false,
      message: 'שגיאה בבדיקה'
    });
  }
});
module.exports = router; 