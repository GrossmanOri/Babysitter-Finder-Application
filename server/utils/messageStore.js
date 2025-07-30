const fs = require('fs');
const path = require('path');
const MESSAGES_FILE = path.join(__dirname, '../data/messages.json');
console.log('Messages file path:', MESSAGES_FILE);
console.log('Current path:', __dirname);
console.log('Working directory:', process.cwd());
function readMessages() {
    try {
        if (!fs.existsSync(MESSAGES_FILE)) {
            fs.writeFileSync(MESSAGES_FILE, '[]');
        }
        const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading messages:', error);
        return [];
    }
}
function writeMessages(messages) {
    try {
        console.log('Saving messages to file:', MESSAGES_FILE);
        console.log('Number of messages:', messages.length);
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
        console.log('Messages saved successfully!');
        return true;
    } catch (error) {
        console.error('Error saving messages:', error);
        return false;
    }
}
function addMessage(senderId, receiverId, content) {
    console.log('Adding new message:', { senderId, receiverId, content });
    const messages = readMessages();
    const newMessage = {
        id: Date.now().toString(),
        senderId: senderId,
        receiverId: receiverId,
        content: content,
        isRead: false,
        createdAt: new Date().toISOString()
    };
    console.log('New message:', newMessage);
    messages.push(newMessage);
    const success = writeMessages(messages);
    if (success) {
        console.log('Message added successfully!');
    } else {
        console.log('Error adding message!');
    }
    return newMessage;
}
function getConversation(user1Id, user2Id, limit = 50) {
    const messages = readMessages();
    return messages
        .filter(msg => 
            (msg.senderId === user1Id && msg.receiverId === user2Id) ||
            (msg.senderId === user2Id && msg.receiverId === user1Id)
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit)
        .reverse(); 
}
function getConversations(userId) {
    const messages = readMessages();
    const conversations = {};
    messages.forEach(message => {
        const senderId = message.senderId;
        const receiverId = message.receiverId;
        if (senderId !== userId && receiverId !== userId) {
            return; 
        }
        const otherUserId = senderId === userId ? receiverId : senderId;
        if (!conversations[otherUserId]) {
            conversations[otherUserId] = {
                _id: otherUserId,
                lastMessage: message,
                unreadCount: 0
            };
        } else {
            const currentLastMessage = conversations[otherUserId].lastMessage;
            const currentTime = new Date(currentLastMessage.createdAt);
            const newTime = new Date(message.createdAt);
            if (newTime > currentTime) {
                conversations[otherUserId].lastMessage = message;
            }
        }
        if (receiverId === userId && !message.isRead) {
            conversations[otherUserId].unreadCount++;
        }
    });
    return Object.values(conversations).sort((a, b) => 
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );
}
function markAsRead(senderId, receiverId) {
    const messages = readMessages();
    let updated = false;
    messages.forEach(message => {
        if (message.senderId === senderId && message.receiverId === receiverId && !message.isRead) {
            message.isRead = true;
            updated = true;
        }
    });
    if (updated) {
        writeMessages(messages);
    }
    return updated;
}
function deleteConversation(user1Id, user2Id) {
    const messages = readMessages();
    const originalCount = messages.length;
    const filteredMessages = messages.filter(message => {
        const isBetweenUsers = 
            (message.senderId === user1Id && message.receiverId === user2Id) ||
            (message.senderId === user2Id && message.receiverId === user1Id);
        return !isBetweenUsers;
    });
    const deletedCount = originalCount - filteredMessages.length;
    if (deletedCount > 0) {
        writeMessages(filteredMessages);
        console.log(`Deleted ${deletedCount} messages between users ${user1Id} and ${user2Id}`);
    }
    return deletedCount;
}
module.exports = {
    addMessage,
    getConversation,
    getConversations,
    markAsRead,
    deleteConversation,
    readMessages,
    writeMessages
}; 