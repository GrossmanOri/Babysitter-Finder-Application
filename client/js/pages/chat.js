console.log('=== CHAT.JS LOADED ===');
let CHAT_API_BASE_URL = null; // Will be set after API_CONFIG is available
let chatCurrentUser = null;
let currentConversation = null;
let refreshInterval = null;
let messagesList = null;
let messagesContainer = null;
let welcomeMessage = null;
let messageInput = null;
let messageForm = null;
let messageText = null;
let chatTitle = null;
let chatSubtitle = null;
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const userData = localStorage.getItem('userData');
    console.log('Token:', token);
    console.log('User:', user);
    console.log('UserData:', userData);
    if (!token) {
        alert('עליכם להתחבר כדי לגשת לצ\'אט');
        window.location.href = 'login.html';
        return false;
    }
    try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < now) {
                console.log('הטוקן פג תוקף, מפנה להתחברות מחדש');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('userData');
                alert('הטוקן פג תוקף, אנא התחבר מחדש');
                window.location.href = 'login.html';
                return false;
            }
        }
    } catch (e) {
        console.error('שגיאה בבדיקת תוקף הטוקן:', e);
    }
    if (user) {
        try {
            chatCurrentUser = JSON.parse(user);
        } catch (e) {
            console.error('שגיאה בפענוח נתוני משתמש:', e);
        }
    } else if (userData) {
        try {
            chatCurrentUser = JSON.parse(userData);
            localStorage.setItem('user', userData);
        } catch (e) {
            console.error('שגיאה בפענוח נתוני משתמש:', e);
        }
    }
    if (!chatCurrentUser) {
        console.log('אין נתוני משתמש מקומיים, טוען מהשרת...');
        return loadUserFromServer();
    }
    console.log('משתמש נוכחי:', chatCurrentUser);
    if (!chatCurrentUser) {
        console.log('טוען נתוני משתמש מהשרת...');
        return loadUserFromServer();
    }
    return true;
}
function loadUserFromServer() {
    const token = localStorage.getItem('token');
    return fetch(`${CHAT_API_BASE_URL}/users/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('שגיאה בטעינת נתוני משתמש');
        }
        return response.json();
    })
            .then(data => {
            if (data.success) {
                chatCurrentUser = data.user;
                localStorage.setItem('user', JSON.stringify(data.user));
                return true;
            } else {
            throw new Error(data.message || 'שגיאה בטעינת נתוני משתמש');
        }
    })
    .catch(error => {
        console.error('שגיאה בטעינת נתוני משתמש:', error);
        alert('שגיאה בטעינת נתוני משתמש');
        window.location.href = 'login.html';
        return false;
    });
}
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    console.log('בדיקת פרמטרים בURL:', { userId });
    if (userId) {
        console.log('פתיחת שיחה ישירה עם:', userId);
        openDirectChat(userId);
    } else {
        console.log('אין userId בURL, מציג הודעת ברוכים הבאים');
    }
}
function openDirectChat(userId) {
    console.log('פתיחת שיחה ישירה עם:', userId);
    const token = localStorage.getItem('token');
    
    // First, get user details
    fetch(`${CHAT_API_BASE_URL}/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(userData => {
        if (!userData.success) {
            throw new Error(userData.message || 'שגיאה בטעינת פרטי משתמש');
        }
        
        const user = userData.data;
        
        // Check if conversation already exists
        return fetch(`${CHAT_API_BASE_URL}/messages/conversations`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(conversationsData => {
            const existingConversation = conversationsData.conversations?.find(conv => conv._id === userId);
            
            if (existingConversation) {
                console.log('נמצאה שיחה קיימת:', existingConversation);
                // Use existing conversation data
                const conversation = {
                    _id: userId,
                    userId: userId,
                    user: user,
                    lastMessage: existingConversation.lastMessage,
                    unreadCount: existingConversation.unreadCount || 0
                };
                selectConversation(conversation, null);
            } else {
                console.log('יוצר שיחה חדשה עם:', user);
                // Create new conversation
                const conversation = {
                    _id: userId,
                    userId: userId,
                    user: user,
                    lastMessage: { content: 'שיחה חדשה', createdAt: new Date().toISOString() },
                    unreadCount: 0
                };
                selectConversation(conversation, null);
            }
        });
    })
    .catch(error => {
        console.error('שגיאה בפתיחת צ\'אט ישיר:', error);
        showMessagesError('שגיאה בפתיחת הצ\'אט הישיר');
    });
}
function selectConversation(conversation, event) {
    currentConversation = conversation;
    console.log('בחירת שיחה:', conversation);
    if (!conversation) {
        console.error('אין שיחה נבחרת');
        return;
    }
    
    console.log('מצב DOM לפני שינוי:', {
        welcomeMessage: welcomeMessage?.style.display,
        messagesList: messagesList?.style.display,
        messageInput: messageInput?.style.display
    });
    
    const otherUser = conversation.user || { firstName: 'משתמש', lastName: 'לא ידוע', userType: 'unknown' };
    chatTitle.textContent = `${otherUser.firstName} ${otherUser.lastName}`;
    chatSubtitle.textContent = otherUser.userType === 'babysitter' ? 'בייביסיטר' : 'הורה';
    
    // Hide welcome message and show messages area and message input
    if (welcomeMessage) {
        welcomeMessage.classList.add('d-none');
        welcomeMessage.style.display = 'none';
        console.log('הסתרתי הודעת ברוכים הבאים');
    }
    if (messagesList) {
        messagesList.classList.remove('d-none');
        messagesList.style.display = 'block';
        console.log('הצגתי רשימת הודעות');
    }
    if (messageInput) {
        messageInput.classList.remove('d-none');
        messageInput.style.display = 'block';
        console.log('הצגתי קלט הודעה');
    }
    
    console.log('מצב DOM אחרי שינוי:', {
        welcomeMessage: welcomeMessage?.style.display,
        messagesList: messagesList?.style.display,
        messageInput: messageInput?.style.display
    });
    
    const userId = conversation._id || conversation.userId;
    if (userId && userId !== 'undefined') {
        loadMessages(userId);
    } else {
        console.error('אין מזהה משתמש תקין לשיחה:', conversation);
        showMessagesError('אין מזהה משתמש תקין לשיחה');
    }
}
function loadMessages(userId) {
    if (!userId || userId === 'undefined' || userId === 'null') {
        console.error('מזהה משתמש לא תקין:', userId);
        if (currentConversation) {
            showMessagesError('מזהה משתמש לא תקין');
        }
        return;
    }
    const token = localStorage.getItem('token');
    console.log('טוען הודעות עבור משתמש:', userId);
    fetch(`${CHAT_API_BASE_URL}/messages/conversation/${userId}`, {
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
            console.log('הודעות נטענו בהצלחה:', data.data);
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
    messagesList.scrollTop = messagesList.scrollHeight;
}
function createMessageElement(message) {
    const article = document.createElement('article');
    if (!message.sender || !message.sender._id) {
        console.error('הודעה ללא פרטי שולח:', message);
        message.sender = {
            _id: message.senderId || 'unknown',
            firstName: 'משתמש',
            lastName: 'לא ידוע'
        };
    }
            const isOwnMessage = message.sender._id === chatCurrentUser.id;
    article.className = `message-item mb-3 ${isOwnMessage ? 'text-end' : 'text-start'}`;
    article.innerHTML = `
        <section class="d-inline-block ${isOwnMessage ? 'bg-primary text-white' : 'bg-light'} rounded p-3" style="max-width: 70%;">
            <p class="mb-1">${message.content}</p>
            <small class="${isOwnMessage ? 'text-white-50' : 'text-muted'}">${formatTime(message.createdAt)}</small>
        </section>
    `;
    return article;
}
let isSendingMessage = false;
function sendMessage(e) {
    e.preventDefault();
    if (isSendingMessage) {
        console.log('הודעה כבר נשלחת...');
        return;
    }
    const content = messageText.value.trim();
    if (!content) {
        console.log('אין תוכן הודעה');
        return;
    }
    if (!currentConversation) {
        console.log('אין שיחה נבחרת');
        alert('אנא בחרו שיחה מהרשימה');
        return;
    }
    const receiverId = currentConversation._id || currentConversation.userId;
    if (!receiverId) {
        console.log('אין מזהה מקבל:', currentConversation);
        alert('שגיאה: אין מזהה מקבל');
        return;
    }
    isSendingMessage = true;
    const token = localStorage.getItem('token');
    if (!token) {
        alert('אין טוקן. אנא התחבר מחדש.');
        window.location.href = '../index.html';
        return;
    }
    console.log('שולח הודעה ל:', receiverId, 'תוכן:', content);
    console.log('שיחה נוכחית:', currentConversation);
    console.log('שולח בקשת POST ל:', `${CHAT_API_BASE_URL}/messages`);
    console.log('Headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });
    console.log('Body:', {
        receiverId: receiverId,
        content: content
    });
    fetch(`${CHAT_API_BASE_URL}/messages`, {
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
        console.log('תגובה מהשרת:', response.status);
        if (!response.ok) {
            if (response.status === 401) {
                alert('הטוקן פג תוקף. אנא התחבר מחדש.');
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                window.location.href = '../index.html';
                return;
            }
            return response.json().then(errorData => {
                throw new Error(errorData.message || `שגיאה בשליחת הודעה: ${response.status}`);
            }).catch(() => {
                throw new Error(`שגיאה בשליחת הודעה: ${response.status}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('תגובת שרת:', data);
        if (data.success) {
            messageText.value = '';
            console.log('הודעה נשלחה בהצלחה!');
            setTimeout(() => {
                loadMessages(receiverId);
            }, 500);
        } else {
            throw new Error(data.message || 'שגיאה בשליחת הודעה');
        }
    })
    .catch(error => {
        console.error('Error sending message:', error);
        alert('שגיאה בשליחת הודעה: ' + error.message);
    })
    .finally(() => {
        isSendingMessage = false;
    });
}
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
function showMessagesError(message) {
    messagesList.innerHTML = `
        <section class="text-center py-4">
            <i class="bi bi-exclamation-triangle text-danger display-4"></i>
            <p class="text-danger mt-2">${message}</p>
            <button class="btn btn-primary btn-sm" onclick="refreshChat()">נסה שוב</button>
        </section>
    `;
}
function refreshChat() {
    if (currentConversation && currentConversation._id) {
        loadMessages(currentConversation._id);
    }
}
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM CONTENT LOADED ===');
    const authResult = checkAuth();
    if (authResult === false) {
        return; 
    }
    if (authResult === true) {
        initializeChat();
    } else {
        authResult.then(success => {
            if (success) {
                initializeChat();
            }
        });
    }
});
function initializeChat() {
    console.log('=== INITIALIZING CHAT PAGE ===');
    
    // Initialize CHAT_API_BASE_URL
    if (typeof API_CONFIG !== 'undefined') {
        CHAT_API_BASE_URL = API_CONFIG.getBaseUrl();
        console.log('CHAT_API_BASE_URL initialized:', CHAT_API_BASE_URL);
    } else {
        console.error('API_CONFIG not available');
        return;
    }
    
    console.log('מתחיל את הצ\'אט...');
    
    // Initialize DOM element references
    messagesList = document.getElementById('messagesList');
    messagesContainer = document.getElementById('messagesContainer');
    welcomeMessage = document.getElementById('welcomeMessage');
    messageInput = document.getElementById('messageInput');
    messageForm = document.getElementById('messageForm');
    messageText = document.getElementById('messageText');
    chatTitle = document.getElementById('chatTitle');
    chatSubtitle = document.getElementById('chatSubtitle');
    
    // Debug DOM elements
    console.log('בדיקת אלמנטי DOM:');
    console.log('messageInput:', messageInput);
    console.log('messagesList:', messagesList);
    console.log('welcomeMessage:', welcomeMessage);
    
    // Verify all required elements exist
    if (!messageInput || !messagesList || !welcomeMessage) {
        console.error('שגיאה: לא נמצאו כל האלמנטים הנדרשים');
        return;
    }
    
    // Set initial UI state
    resetUIState();
    
    const token = localStorage.getItem('token');
    if (token) {
        fetch(`${CHAT_API_BASE_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            if (!response.ok) {
                console.log('טוקן לא תקין, מעביר להתחברות');
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                window.location.href = '../index.html';
                return;
            }
        }).catch(error => {
            console.error('שגיאה בבדיקת טוקן:', error);
        });
    }
    
    const authButtons = document.getElementById('authButtons');
            if (authButtons && chatCurrentUser) {
        authButtons.innerHTML = `
            <li class="nav-item d-flex align-items-center">
                <span class="navbar-text me-3 text-light">
                    שלום, ${chatCurrentUser.firstName || 'משתמש'}!
                </span>
            </li>
            <li class="nav-item d-flex align-items-center">
                <a class="nav-link" href="#" onclick="logout()">
                    <i class="bi bi-box-arrow-right"></i> התנתק
                </a>
            </li>
        `;
    }
    
    const homeLink = document.getElementById('homeLink');
    if (homeLink) {
        homeLink.href = 'profile.html';
        homeLink.onclick = function(e) {
            e.preventDefault();
            window.location.href = 'profile.html';
        };
    }
    
    // Set up message form
    if (messageForm) {
        messageForm.addEventListener('submit', sendMessage);
    }
    
    refreshInterval = setInterval(() => {
        if (currentConversation && currentConversation._id) {
            loadMessages(currentConversation._id);
        }
    }, 30000);
    
    checkUrlParams();
}

/**
 * Resets the UI to initial state (no conversation selected)
 */
function resetUIState() {
    console.log('מאפס מצב UI...');
    
    // Reset current conversation
    currentConversation = null;
    
    // Show welcome message
    if (welcomeMessage) {
        welcomeMessage.style.display = 'flex';
        console.log('הצגתי הודעת ברוכים הבאים');
    }
    
    // Hide messages area and message input
    if (messagesList) {
        messagesList.classList.add('d-none');
        messagesList.style.display = 'none';
        console.log('הסתרתי רשימת הודעות');
    }
    if (messageInput) {
        messageInput.classList.add('d-none');
        messageInput.style.display = 'none';
        console.log('הסתרתי קלט הודעה');
    }
    
    // Reset chat header
    if (chatTitle) {
        chatTitle.textContent = 'בחרו שיחה';
    }
    if (chatSubtitle) {
        chatSubtitle.textContent = '';
    }
    
    console.log('מצב UI אופס בהצלחה');
}
window.addEventListener('beforeunload', function() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}); 