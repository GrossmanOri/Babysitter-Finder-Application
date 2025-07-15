const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/messages - שליחת הודעה חדשה
router.post('/', auth, (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user.id;
  
  // בדיקות תקינות
  if (!receiverId || !content) {
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
  
  // בדיקה שהמקבל קיים
  User.findById(receiverId)
    .then(receiver => {
      if (!receiver) {
        return res.status(404).json({
          success: false,
          message: 'המשתמש לא נמצא'
        });
      }
      
      // יצירת הודעה חדשה
      const newMessage = new Message({
        sender: senderId,
        receiver: receiverId,
        content: content.trim()
      });
      
      return newMessage.save();
    })
    .then(savedMessage => {
      // החזרת ההודעה עם פרטי השולח והמקבל
      return Message.findById(savedMessage._id)
        .populate('sender', 'firstName lastName userType')
        .populate('receiver', 'firstName lastName userType');
    })
    .then(messageWithDetails => {
      res.status(201).json({
        success: true,
        message: 'הודעה נשלחה בהצלחה',
        data: messageWithDetails
      });
    })
    .catch(err => {
      console.error('Error sending message:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה בשליחת ההודעה'
      });
    });
});

// GET /api/messages/conversation/:userId - קבלת שיחה עם משתמש ספציפי
router.get('/conversation/:userId', auth, (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;
  const { limit = 50 } = req.query;
  
  // בדיקה שהמשתמש השני קיים
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'המשתמש לא נמצא'
        });
      }
      
      // קבלת ההודעות
      return Message.getConversation(currentUserId, userId, parseInt(limit));
    })
    .then(messages => {
      // סימון הודעות כנקראו
      return Message.markAsRead(userId, currentUserId)
        .then(() => messages);
    })
    .then(messages => {
      res.json({
        success: true,
        data: messages.reverse() // החזרת הודעות בסדר כרונולוגי
      });
    })
    .catch(err => {
      console.error('Error fetching conversation:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה בטעינת השיחה'
      });
    });
});

// GET /api/messages/conversations - קבלת רשימת שיחות של המשתמש
router.get('/conversations', auth, (req, res) => {
  const currentUserId = req.user.id;
  
  Message.getConversations(currentUserId)
    .then(conversations => {
      // הוספת פרטי המשתמשים לכל שיחה
      const userIds = conversations.map(conv => conv._id);
      
      return User.find({ _id: { $in: userIds } })
        .select('firstName lastName userType')
        .then(users => {
          const usersMap = {};
          users.forEach(user => {
            usersMap[user._id] = user;
          });
          
          const conversationsWithUsers = conversations.map(conv => ({
            ...conv,
            user: usersMap[conv._id],
            lastMessage: {
              ...conv.lastMessage,
              sender: usersMap[conv.lastMessage.sender],
              receiver: usersMap[conv.lastMessage.receiver]
            }
          }));
          
          return conversationsWithUsers;
        });
    })
    .then(conversationsWithUsers => {
      res.json({
        success: true,
        data: conversationsWithUsers
      });
    })
    .catch(err => {
      console.error('Error fetching conversations:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה בטעינת השיחות'
      });
    });
});

// GET /api/messages/unread/count - קבלת מספר הודעות שלא נקראו
router.get('/unread/count', auth, (req, res) => {
  const currentUserId = req.user.id;
  
  Message.countDocuments({
    receiver: currentUserId,
    isRead: false
  })
    .then(count => {
      res.json({
        success: true,
        data: { unreadCount: count }
      });
    })
    .catch(err => {
      console.error('Error counting unread messages:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה בספירת הודעות שלא נקראו'
      });
    });
});

// PUT /api/messages/:messageId/read - סימון הודעה כנקראה
router.put('/:messageId/read', auth, (req, res) => {
  const { messageId } = req.params;
  const currentUserId = req.user.id;
  
  Message.findById(messageId)
    .then(message => {
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'ההודעה לא נמצאה'
        });
      }
      
      // בדיקה שהמשתמש הוא המקבל של ההודעה
      if (message.receiver.toString() !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'אין לך הרשאה לסמן הודעה זו כנקראה'
        });
      }
      
      message.isRead = true;
      return message.save();
    })
    .then(updatedMessage => {
      res.json({
        success: true,
        message: 'ההודעה סומנה כנקראה',
        data: updatedMessage
      });
    })
    .catch(err => {
      console.error('Error marking message as read:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה בסימון ההודעה כנקראה'
      });
    });
});

// GET /api/messages - קבלת כל ההודעות של המשתמש (CRUD - Read)
router.get('/', auth, (req, res) => {
  const currentUserId = req.user.id;
  const { limit = 50, page = 1, isRead } = req.query;
  
  const filter = {
    $or: [
      { sender: currentUserId },
      { receiver: currentUserId }
    ]
  };
  
  if (isRead !== undefined) {
    filter.isRead = isRead === 'true';
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  Message.find(filter)
    .populate('sender', 'firstName lastName userType')
    .populate('receiver', 'firstName lastName userType')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .then(messages => {
      Message.countDocuments(filter)
        .then(total => {
          res.json({
            success: true,
            data: messages,
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
      console.error('Error fetching messages:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה בטעינת הודעות'
      });
    });
});

// PUT /api/messages/:messageId - עדכון הודעה (CRUD - Update)
router.put('/:messageId', auth, (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const currentUserId = req.user.id;
  
  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'תוכן ההודעה לא יכול להיות ריק'
    });
  }
  
  Message.findById(messageId)
    .then(message => {
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'ההודעה לא נמצאה'
        });
      }
      
      // בדיקה שהמשתמש הוא השולח של ההודעה
      if (message.sender.toString() !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'אין לך הרשאה לעדכן הודעה זו'
        });
      }
      
      // בדיקה שההודעה לא נשלחה לפני יותר מ-5 דקות
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (message.createdAt < fiveMinutesAgo) {
        return res.status(400).json({
          success: false,
          message: 'לא ניתן לעדכן הודעה שנשלחה לפני יותר מ-5 דקות'
        });
      }
      
      message.content = content.trim();
      return message.save();
    })
    .then(updatedMessage => {
      return Message.findById(updatedMessage._id)
        .populate('sender', 'firstName lastName userType')
        .populate('receiver', 'firstName lastName userType');
    })
    .then(messageWithDetails => {
      res.json({
        success: true,
        message: 'ההודעה עודכנה בהצלחה',
        data: messageWithDetails
      });
    })
    .catch(err => {
      console.error('Error updating message:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה בעדכון ההודעה'
      });
    });
});

// DELETE /api/messages/:messageId - מחיקת הודעה (CRUD - Delete)
router.delete('/:messageId', auth, (req, res) => {
  const { messageId } = req.params;
  const currentUserId = req.user.id;
  
  Message.findById(messageId)
    .then(message => {
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'ההודעה לא נמצאה'
        });
      }
      
      // בדיקה שהמשתמש הוא השולח של ההודעה
      if (message.sender.toString() !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'אין לך הרשאה למחוק הודעה זו'
        });
      }
      
      // בדיקה שההודעה לא נשלחה לפני יותר מ-5 דקות
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (message.createdAt < fiveMinutesAgo) {
        return res.status(400).json({
          success: false,
          message: 'לא ניתן למחוק הודעה שנשלחה לפני יותר מ-5 דקות'
        });
      }
      
      return Message.findByIdAndDelete(messageId);
    })
    .then(deletedMessage => {
      res.json({
        success: true,
        message: 'ההודעה נמחקה בהצלחה'
      });
    })
    .catch(err => {
      console.error('Error deleting message:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאה במחיקת ההודעה'
      });
    });
});

module.exports = router; 