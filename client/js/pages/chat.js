// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Global Variables
let currentUser = null;
let currentConversation = null;
let refreshInterval = null;

// DOM Elements
const conversationsList = document.getElementById('conversationsList');
const messagesList = document.getElementById('messagesList');
const messagesContainer = document.getElementById('messagesContainer');
const welcomeMessage = document.getElementById('welcomeMessage');
const messageInput = document.getElementById('messageInput');
const messageForm = document.getElementById('messageForm');
const messageText = document.getElementById('messageText');
const chatTitle = document.getElementById('chatTitle');
const chatSubtitle = document.getElementById('chatSubtitle');

// Check Authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        alert('עליכם להתחבר כדי לגשת לצ\'אט');
        window.location.href = 'login.html';
        return false;
    }
    
    currentUser = JSON.parse(user);
    return true;
}

// Load Conversations
function loadConversations() {
    const token = localStorage.getItem('token');
    
    fetch(`${API_BASE_URL}/messages/conversations`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('שגיאה בטעינת שיחות');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            displayConversations(data.data);
        } else {
            throw new Error(data.message || 'שגיאה בטעינת שיחות');
        }
    })
    .catch(error => {
        console.error('Error loading conversations:', error);
        showConversationsError('שגיאה בטעינת שיחות: ' + error.message);
    });
}

// Display Conversations
function displayConversations(conversations) {
    if (conversations.length === 0) {
        conversationsList.innerHTML = `
            <section class="text-center py-4">
                <i class="bi bi-chat-dots text-muted display-4"></i>
                <p class="text-muted mt-2">אין שיחות עדיין</p>
                <a href="search.html" class="btn btn-primary btn-sm">חפש ביביסיטרים</a>
            </section>
        `;
        return;
    }
    
    conversationsList.innerHTML = '';
    
    conversations.forEach(conversation => {
        const conversationElement = createConversationElement(conversation);
        conversationsList.appendChild(conversationElement);
    });
}

// Create Conversation Element
function createConversationElement(conversation) {
    const article = document.createElement('article');
    article.className = 'conversation-item border-bottom p-3 cursor-pointer';
    article.onclick = () => selectConversation(conversation);
    
    const lastMessage = conversation.lastMessage;
    const otherUser = conversation.user;
    const isUnread = conversation.unreadCount > 0;
    
    article.innerHTML = `
        <section class="d-flex justify-content-between align-items-start">
            <section class="flex-grow-1">
                <h6 class="mb-1 ${isUnread ? 'fw-bold' : ''}">${otherUser.firstName} ${otherUser.lastName}</h6>
                <p class="text-muted small mb-1">${otherUser.userType === 'babysitter' ? 'בייביסיטר' : 'הורה'}</p>
                <p class="text-muted small mb-0">${lastMessage.content.substring(0, 50)}${lastMessage.content.length > 50 ? '...' : ''}</p>
            </section>
            <section class="text-end">
                <small class="text-muted">${formatTime(lastMessage.createdAt)}</small>
                ${isUnread ? `<section class="badge bg-primary rounded-pill mt-1">${conversation.unreadCount}</section>` : ''}
            </section>
        </section>
    `;
    
    return article;
}

// Select Conversation
function selectConversation(conversation) {
    currentConversation = conversation;
    
    // Update UI
    const otherUser = conversation.user;
    chatTitle.textContent = `${otherUser.firstName} ${otherUser.lastName}`;
    chatSubtitle.textContent = otherUser.userType === 'babysitter' ? 'בייביסיטר' : 'הורה';
    
    // Show chat area
    welcomeMessage.classList.add('d-none');
    messagesList.classList.remove('d-none');
    messageInput.classList.remove('d-none');
    
    // Load messages
    loadMessages(conversation._id);
    
    // Mark as active in conversations list
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active', 'bg-light');
    });
    event.currentTarget.classList.add('active', 'bg-light');
}

// Load Messages
function loadMessages(userId) {
    const token = localStorage.getItem('token');
    
    fetch(`${API_BASE_URL}/messages/conversation/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('שגיאה בטעינת הודעות');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            displayMessages(data.data);
        } else {
            throw new Error(data.message || 'שגיאה בטעינת הודעות');
        }
    })
    .catch(error => {
        console.error('Error loading messages:', error);
        showMessagesError('שגיאה בטעינת הודעות: ' + error.message);
    });
}

// Display Messages
function displayMessages(messages) {
    messagesList.innerHTML = '';
    
    if (messages.length === 0) {
        messagesList.innerHTML = `
            <section class="text-center py-4">
                <p class="text-muted">אין הודעות עדיין</p>
                <p class="text-muted small">התחילו שיחה!</p>
            </section>
        `;
        return;
    }
    
    messages.forEach(message => {
        const messageElement = createMessageElement(message);
        messagesList.appendChild(messageElement);
    });
    
    // Scroll to bottom
    messagesList.scrollTop = messagesList.scrollHeight;
}

// Create Message Element
function createMessageElement(message) {
    const article = document.createElement('article');
    const isOwnMessage = message.sender._id === currentUser.id;
    
    article.className = `message-item mb-3 ${isOwnMessage ? 'text-end' : 'text-start'}`;
    
    article.innerHTML = `
        <section class="d-inline-block ${isOwnMessage ? 'bg-primary text-white' : 'bg-light'} rounded p-3" style="max-width: 70%;">
            <p class="mb-1">${message.content}</p>
            <small class="${isOwnMessage ? 'text-white-50' : 'text-muted'}">${formatTime(message.createdAt)}</small>
        </section>
    `;
    
    return article;
}

// Send Message
function sendMessage(e) {
    e.preventDefault();
    
    const content = messageText.value.trim();
    if (!content || !currentConversation) return;
    
    const token = localStorage.getItem('token');
    const receiverId = currentConversation._id;
    
    fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            receiverId: receiverId,
            content: content
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('שגיאה בשליחת הודעה');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            messageText.value = '';
            // Reload messages to show the new message
            loadMessages(receiverId);
            // Reload conversations to update the last message
            loadConversations();
        } else {
            throw new Error(data.message || 'שגיאה בשליחת הודעה');
        }
    })
    .catch(error => {
        console.error('Error sending message:', error);
        alert('שגיאה בשליחת הודעה: ' + error.message);
    });
}

// Format Time
function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
        return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
        return 'אתמול';
    } else {
        return date.toLocaleDateString('he-IL');
    }
}

// Show Conversations Error
function showConversationsError(message) {
    conversationsList.innerHTML = `
        <section class="text-center py-4">
            <i class="bi bi-exclamation-triangle text-danger display-4"></i>
            <p class="text-danger mt-2">${message}</p>
            <button class="btn btn-primary btn-sm" onclick="loadConversations()">נסה שוב</button>
        </section>
    `;
}

// Show Messages Error
function showMessagesError(message) {
    messagesList.innerHTML = `
        <section class="text-center py-4">
            <i class="bi bi-exclamation-triangle text-danger display-4"></i>
            <p class="text-danger mt-2">${message}</p>
            <button class="btn btn-primary btn-sm" onclick="loadMessages(currentConversation._id)">נסה שוב</button>
        </section>
    `;
}

// Refresh Chat
function refreshChat() {
    if (currentConversation) {
        loadMessages(currentConversation._id);
    }
    loadConversations();
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

// Event Listeners
messageForm.addEventListener('submit', sendMessage);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    
    // Load conversations
    loadConversations();
    
    // Set up auto-refresh every 30 seconds
    refreshInterval = setInterval(() => {
        if (currentConversation) {
            loadMessages(currentConversation._id);
        }
        loadConversations();
    }, 30000);
    
    // Check if there's a specific user to chat with from URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    
    if (userId) {
        // Load user details and start conversation
        const token = localStorage.getItem('token');
        fetch(`${API_BASE_URL}/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Create a conversation object and select it
                const conversation = {
                    _id: userId,
                    user: data.data,
                    lastMessage: { content: '', createdAt: new Date() },
                    unreadCount: 0
                };
                selectConversation(conversation);
            }
        })
        .catch(error => {
            console.error('Error loading user:', error);
        });
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}); 