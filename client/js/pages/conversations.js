// Conversations page JavaScript file
// Handles chat functionality, message sending, and conversation management

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000/api' 
    : 'https://babysitter-finder-application.onrender.com/api';

// Global variables for chat state
let currentUser = null;
let currentConversation = null;
let refreshInterval = null;
let isSendingMessage = false;
let allConversations = []; // Store all conversations globally

// DOM element references - will be initialized after DOM loads
let conversationsList = null;
let messagesList = null;
let messagesContainer = null;
let welcomeMessage = null;
let messageInput = null;
let messageForm = null;
let messageText = null;
let chatTitle = null;
let chatSubtitle = null;
let deleteConversationBtn = null;

/**
 * Checks if user is authenticated and redirects if not
 * @returns {boolean} True if authenticated, false otherwise
 */
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const userData = localStorage.getItem('userData');
    
    console.log('בדיקת אימות:');
    console.log('Token:', token ? 'קיים' : 'לא קיים');
    console.log('User:', user ? 'קיים' : 'לא קיים');
    console.log('UserData:', userData ? 'קיים' : 'לא קיים');
    
    if (!token || (!user && !userData)) {
        console.log('לא מחובר - מעביר לדף ההתחברות');
        window.location.href = '../index.html';
        return false;
    }
    
    try {
        currentUser = JSON.parse(userData || user);
        console.log('משתמש נוכחי:', currentUser);
        return true;
    } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('user');
        window.location.href = '../index.html';
        return false;
    }
}

/**
 * Sets up the navigation based on user authentication status
 */
function setupNavigation() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        try {
            const user = JSON.parse(userData);
            currentUser = user;
            
            // Set up auth buttons for logged-in user
            const authButtons = document.getElementById('authButtons');
            if (authButtons) {
                authButtons.innerHTML = `
                    <li class="nav-item d-flex align-items-center">
                        <span class="navbar-text me-3 text-light">
                            שלום, ${user.firstName || 'משתמש'}!
                        </span>
                    </li>
                    <li class="nav-item d-flex align-items-center">
                        <a class="nav-link" href="#" onclick="logout()">
                            <i class="bi bi-box-arrow-right"></i> התנתק
                        </a>
                    </li>
                `;
            }
            
            // Set up home link for logged-in user
            const homeLink = document.getElementById('homeLink');
            if (homeLink) {
                homeLink.href = 'profile.html';
                homeLink.onclick = function(e) {
                    e.preventDefault();
                    window.location.href = 'profile.html';
                };
            }
            
            // Set up role-based menu
            setupRoleBasedMenu(user.userType);
            
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    } else {
        // Set up home link for guest user
        const homeLink = document.getElementById('homeLink');
        if (homeLink) {
            homeLink.href = '../index.html';
        }
    }
}

/**
 * Sets up the navigation menu based on user type
 * @param {string} userType - The type of user (parent/babysitter)
 */
function setupRoleBasedMenu(userType) {
    const navigationMenu = document.getElementById('navigationMenu');
    if (!navigationMenu) return;
    
    let menuItems = '';
    
    if (userType === 'parent') {
        // Navigation items for parents
        menuItems = `
            <li class="nav-item">
                <a class="nav-link" href="search.html">חיפוש בייביסיטר</a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" href="conversations.html">שיחות</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="about.html">אודות</a>
            </li>
        `;
    } else if (userType === 'babysitter') {
        // Navigation items for babysitters
        menuItems = `
            <li class="nav-item">
                <a class="nav-link active" href="conversations.html">שיחות</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="about.html">אודות</a>
            </li>
        `;
    }
    
    navigationMenu.innerHTML = menuItems;
}

/**
 * Loads conversations from the server
 */
function loadConversations() {
    console.log('טוען שיחות...');
    const token = localStorage.getItem('token');
    console.log('Token for conversations:', token ? 'קיים' : 'לא קיים');
    
    fetch(`${API_BASE_URL}/messages/conversations`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('שיחות שהתקבלו:', data);
        console.log('data.success:', data.success);
        console.log('data.data:', data.data);
        console.log('data.conversations:', data.conversations);
        const conversations = data.data || data.conversations || [];
        console.log('conversations array:', conversations);
        displayConversations(conversations);
    })
    .catch(error => {
        console.error('Error loading conversations:', error);
        showConversationsError('שגיאה בטעינת השיחות');
    });
}

/**
 * Displays conversations in the sidebar
 * @param {Array} conversations - Array of conversation objects
 */
function displayConversations(conversations) {
    console.log('מציג שיחות:', conversations);
    console.log('conversations.length:', conversations.length);
    console.log('conversations type:', typeof conversations);
    console.log('conversations is array:', Array.isArray(conversations));
    
    if (!conversations || conversations.length === 0) {
        console.log('אין שיחות להצגה');
        conversationsList.innerHTML = `
            <section class="text-center py-4">
                <i class="bi bi-chat-dots text-muted display-4"></i>
                <p class="text-muted mt-2">אין שיחות עדיין</p>
                <a href="search.html" class="btn btn-primary btn-sm">חפשו בייביסיטר</a>
            </section>
        `;
        
        // Ensure UI is in correct state when no conversations
        resetUIState();
        return;
    }
    
    // Sort conversations by last message time
    conversations.sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));
    
    // Store conversations globally
    allConversations = conversations;
    
    conversationsList.innerHTML = conversations.map(conversation => 
        createConversationElement(conversation)
    ).join('');
    
    // Check for auto-select parameter
    const urlParams = new URLSearchParams(window.location.search);
    const selectUserId = urlParams.get('select');
    
    if (selectUserId) {
        console.log('מחפש שיחה לאוטו-סלקט:', selectUserId);
        const conversationToSelect = conversations.find(conv => conv._id === selectUserId);
        if (conversationToSelect) {
            console.log('נמצאה שיחה לאוטו-סלקט:', conversationToSelect);
            // Auto-select the conversation
            selectConversation(conversationToSelect, null);
            // Clear the URL parameter to avoid re-selecting on refresh
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        } else {
            console.log('לא נמצאה שיחה עם המזהה:', selectUserId);
        }
    }
}

/**
 * Creates HTML element for a conversation
 * @param {Object} conversation - Conversation object
 * @returns {string} HTML string for conversation element
 */
function createConversationElement(conversation) {
    const time = formatConversationTime(conversation.lastMessage.createdAt);
    const isActive = currentConversation && currentConversation._id === conversation._id;
    
    return `
        <section class="conversation-item p-3 border-bottom ${isActive ? 'bg-light' : ''}" 
                 data-conversation-id="${conversation._id}"
                 onclick="selectConversationById('${conversation._id}')">
            <section class="d-flex justify-content-between align-items-start">
                <section>
                    <h6 class="mb-1">${conversation.user ? `${conversation.user.firstName} ${conversation.user.lastName}` : 'משתמש לא ידוע'}</h6>
                    <p class="text-muted mb-1 small">${conversation.lastMessage ? conversation.lastMessage.content : 'אין הודעות'}</p>
                </section>
                <section class="text-end">
                    <small class="text-muted conversation-time">${time}</small>
                    ${conversation.unreadCount > 0 ? `<span class="badge bg-primary ms-1">${conversation.unreadCount}</span>` : ''}
                </section>
            </section>
        </section>
    `;
}

/**
 * Selects a conversation by ID
 * @param {string} conversationId - ID of the conversation to select
 */
function selectConversationById(conversationId) {
    console.log('בוחר שיחה לפי מזהה:', conversationId);
    const conversation = allConversations.find(conv => conv._id === conversationId);
    if (conversation) {
        selectConversation(conversation, null);
    } else {
        console.error('שיחה לא נמצאה:', conversationId);
    }
}

/**
 * Selects a conversation and loads its messages
 * @param {Object} conversation - Conversation object
 * @param {Event} event - Click event
 */
function selectConversation(conversation, event) {
    console.log('בוחר שיחה:', conversation);
    console.log('מבנה השיחה:', {
        _id: conversation._id,
        userId: conversation.userId,
        user: conversation.user,
        user_id: conversation.user?._id,
        lastMessage: conversation.lastMessage
    });
    
    // Update current conversation
    currentConversation = conversation;
    
    // Update UI to show selected conversation
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('bg-light');
    });
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('bg-light');
    }
    
    // Update chat header
    const conversationName = conversation.user ? `${conversation.user.firstName} ${conversation.user.lastName}` : 'משתמש לא ידוע';
    chatTitle.textContent = conversationName;
    chatSubtitle.textContent = `שיחה עם ${conversationName}`;
    
    // Show delete button and hide welcome message
    deleteConversationBtn.style.display = 'block';
    welcomeMessage.style.display = 'none';
    welcomeMessage.classList.add('d-none');
    welcomeMessage.style.visibility = 'hidden';
    welcomeMessage.style.opacity = '0';
    welcomeMessage.style.position = 'absolute';
    welcomeMessage.style.zIndex = '-1';
    welcomeMessage.style.pointerEvents = 'none';
    
    // Show messages area and message input
    messagesList.classList.remove('d-none');
    messagesList.style.display = 'block';
    messageInput.classList.remove('d-none');
    messageInput.style.display = 'block';
    
    // Load messages for this conversation - try different ID fields
    let targetUserId = null;
    if (conversation._id) {
        targetUserId = conversation._id;
        console.log('משתמש ID מהשדה _id:', targetUserId);
    } else if (conversation.user && conversation.user._id) {
        targetUserId = conversation.user._id;
        console.log('משתמש ID מהשדה user._id:', targetUserId);
    } else if (conversation.userId) {
        targetUserId = conversation.userId;
        console.log('משתמש ID מהשדה userId:', targetUserId);
    }
    
    if (targetUserId) {
        loadMessages(targetUserId);
    } else {
        console.error('שגיאה: לא ניתן למצוא מזהה משתמש בשיחה:', conversation);
        showMessagesError('שגיאה בטעינת ההודעות - מידע משתמש חסר');
    }
}

/**
 * Loads messages for a specific conversation
 * @param {string} userId - ID of the other user in the conversation
 */
function loadMessages(userId) {
    console.log('טוען הודעות עבור משתמש:', userId);
    const token = localStorage.getItem('token');
    console.log('Token for messages:', token ? 'קיים' : 'לא קיים');
    
    if (!userId) {
        console.error('שגיאה: userId הוא undefined או null');
        showMessagesError('שגיאה בטעינת ההודעות - מזהה משתמש חסר');
        return;
    }
    
    fetch(`${API_BASE_URL}/messages/conversation/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('הודעות שהתקבלו:', data);
        if (data.success && data.data) {
            displayMessages(data.data);
        } else {
            console.error('תגובה לא תקינה מהשרת:', data);
            showMessagesError('שגיאה בטעינת ההודעות');
        }
    })
    .catch(error => {
        console.error('Error loading messages:', error);
        showMessagesError('שגיאה בטעינת ההודעות');
    });
}

/**
 * Displays messages in the chat area
 * @param {Array} messages - Array of message objects
 */
function displayMessages(messages) {
    console.log('מציג הודעות:', messages);
    console.log('מצב UI לפני הצגת הודעות:');
    console.log('- welcomeMessage display:', welcomeMessage?.style.display);
    console.log('- welcomeMessage classList:', welcomeMessage?.classList.toString());
    console.log('- messagesList display:', messagesList?.style.display);
    console.log('- messagesList classList:', messagesList?.classList.toString());
    
    // Aggressively hide welcome message
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
        welcomeMessage.classList.add('d-none');
        welcomeMessage.style.visibility = 'hidden';
        welcomeMessage.style.opacity = '0';
        welcomeMessage.style.position = 'absolute';
        welcomeMessage.style.zIndex = '-1';
        welcomeMessage.style.pointerEvents = 'none';
        console.log('הסתרתי הודעת ברוכים הבאים - כל השיטות');
    }
    
    if (messages.length === 0) {
        messagesList.innerHTML = `
            <section class="text-center text-muted">
                <p>אין הודעות עדיין</p>
                <p>התחילו את השיחה!</p>
            </section>
        `;
        return;
    }
    
    // Sort messages by timestamp
    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    messagesList.innerHTML = messages.map(message => 
        createMessageElement(message)
    ).join('');
    
    // Scroll to bottom
    messagesList.scrollTop = messagesList.scrollHeight;
    
    console.log('מצב UI אחרי הצגת הודעות:');
    console.log('- welcomeMessage display:', welcomeMessage?.style.display);
    console.log('- welcomeMessage classList:', welcomeMessage?.classList.toString());
    console.log('- messagesList display:', messagesList?.style.display);
    console.log('- messagesList classList:', messagesList?.classList.toString());
}

/**
 * Creates HTML element for a message
 * @param {Object} message - Message object
 * @returns {string} HTML string for message element
 */
function createMessageElement(message) {
    console.log('יצירת אלמנט הודעה:', message);
    console.log('שדות ההודעה:', {
        id: message.id,
        senderId: message.senderId,
        content: message.content,
        createdAt: message.createdAt,
        timestamp: message.timestamp,
        date: message.date
    });
    
    const isOwnMessage = message.senderId === currentUser.id;
    
    // Try different timestamp field names
    let time = '--:--';
    if (message.createdAt) {
        time = formatTime(message.createdAt);
    } else if (message.timestamp) {
        time = formatTime(message.timestamp);
    } else if (message.date) {
        time = formatTime(message.date);
    }
    
    return `
        <section class="message ${isOwnMessage ? 'message-own' : 'message-other'} mb-3">
            <section class="message-content p-2 rounded ${isOwnMessage ? 'bg-primary text-white' : 'bg-light'}">
                <p class="mb-1">${message.content}</p>
                <small class="${isOwnMessage ? 'text-white-50' : 'text-muted'}">${time}</small>
            </section>
        </section>
    `;
}

/**
 * Sends a new message
 * @param {Event} e - Form submit event
 */
function sendMessage(e) {
    e.preventDefault();
    
    if (isSendingMessage || !currentConversation) {
        console.log('לא ניתן לשלוח הודעה - אין שיחה נבחרת או כבר שולח הודעה');
        return;
    }
    
    if (!currentConversation.user || !currentConversation.user._id) {
        console.error('שגיאה: אין מידע על המשתמש בשיחה הנוכחית:', currentConversation);
        alert('שגיאה: אין מידע על המשתמש בשיחה. נסו לבחור שיחה אחרת.');
        return;
    }
    
    const messageContent = messageText.value.trim();
    if (!messageContent) {
        return;
    }
    
    isSendingMessage = true;
    const originalText = messageText.value;
    messageText.value = '';
    
    console.log('שולח הודעה:', messageContent);
    const token = localStorage.getItem('token');
    console.log('Token for sending message:', token ? 'קיים' : 'לא קיים');
    
    fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            receiverId: currentConversation.user._id,
            content: messageContent
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('הודעה נשלחה בהצלחה:', data);
        
        // Add the new message to the chat
        const newMessage = {
            id: data.message.id,
            content: messageContent,
            senderId: currentUser.id,
            timestamp: new Date().toISOString()
        };
        
        // Append message to the list
        messagesList.insertAdjacentHTML('beforeend', createMessageElement(newMessage));
        
        // Scroll to bottom
        messagesList.scrollTop = messagesList.scrollHeight;
        
        // Refresh conversations list to update last message
        loadConversations();
        
    })
    .catch(error => {
        console.error('Error sending message:', error);
        messageText.value = originalText;
        alert('שגיאה בשליחת ההודעה. נסו שוב.');
    })
    .finally(() => {
        isSendingMessage = false;
    });
}

/**
 * Shows error message for conversations loading
 * @param {string} message - Error message to display
 */
function showConversationsError(message) {
    conversationsList.innerHTML = `
        <section class="text-center py-4">
            <i class="bi bi-exclamation-triangle text-danger display-4"></i>
            <p class="text-danger mt-2">${message}</p>
        </section>
    `;
}

/**
 * Shows error message for messages loading
 * @param {string} message - Error message to display
 */
function showMessagesError(message) {
    console.log('מציג שגיאת הודעות:', message);
    console.log('מצב UI לפני הצגת שגיאה:');
    console.log('- welcomeMessage display:', welcomeMessage?.style.display);
    console.log('- messagesList display:', messagesList?.style.display);
    
    messagesList.innerHTML = `
        <section class="text-center text-danger">
            <p>${message}</p>
            <button class="btn btn-primary btn-sm" onclick="retryLoadMessages()">נסה שוב</button>
        </section>
    `;
    
    console.log('מצב UI אחרי הצגת שגיאה:');
    console.log('- welcomeMessage display:', welcomeMessage?.style.display);
    console.log('- messagesList display:', messagesList?.style.display);
}

/**
 * Retries loading messages with the correct user ID
 */
function retryLoadMessages() {
    if (!currentConversation) {
        console.error('אין שיחה נבחרת');
        return;
    }
    
    let targetUserId = null;
    if (currentConversation._id) {
        targetUserId = currentConversation._id;
    } else if (currentConversation.user && currentConversation.user._id) {
        targetUserId = currentConversation.user._id;
    } else if (currentConversation.userId) {
        targetUserId = currentConversation.userId;
    }
    
    if (targetUserId) {
        loadMessages(targetUserId);
    } else {
        console.error('לא ניתן למצוא מזהה משתמש לשיחה הנוכחית');
        showMessagesError('שגיאה בטעינת ההודעות - מזהה משתמש חסר');
    }
}

/**
 * Deletes the current conversation
 */
function deleteConversation() {
    if (!currentConversation) {
        return;
    }
    
    if (!currentConversation.user || !currentConversation.user._id) {
        console.error('שגיאה: אין מידע על המשתמש בשיחה הנוכחית:', currentConversation);
        alert('שגיאה: אין מידע על המשתמש בשיחה. לא ניתן למחוק את השיחה.');
        return;
    }
    
    if (!confirm('האם אתם בטוחים שברצונכם למחוק את השיחה הזו?')) {
        return;
    }
    
    console.log('מוחק שיחה:', currentConversation);
    
    fetch(`${API_BASE_URL}/messages/conversation/${currentConversation.user._id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('שיחה נמחקה בהצלחה:', data);
        
        // Reset UI state
        resetUIState();
        
        // Reload conversations
        loadConversations();
        
        // Show success message
        alert('השיחה נמחקה בהצלחה');
        
    })
    .catch(error => {
        console.error('שגיאה במחיקת שיחה:', error);
        alert('שגיאה במחיקת השיחה. נסו שוב.');
    });
}

/**
 * Refreshes the chat by reloading conversations and messages
 */
function refreshChat() {
    console.log('מרענן צ\'אט...');
    loadConversations();
    
    if (currentConversation && currentConversation.user && currentConversation.user._id) {
        loadMessages(currentConversation.user._id);
    } else if (currentConversation) {
        console.error('שגיאה: אין מידע על המשתמש בשיחה הנוכחית:', currentConversation);
        showMessagesError('שגיאה בטעינת ההודעות - מידע משתמש חסר');
    }
}

/**
 * Logs out the user and redirects to home page
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

/**
 * Formats a date string to display time in HH:MM format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time string
 */
function formatTime(dateString) {
    if (!dateString) {
        return '--:--';
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return '--:--';
    }
    return date.toLocaleTimeString('he-IL', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

/**
 * Formats conversation time to show only HH:MM
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time string
 */
function formatConversationTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('he-IL', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

/**
 * Initializes the conversations page
 */
function initializeConversations() {
    console.log('מתחיל אתחול דף שיחות...');
    
    if (!checkAuth()) {
        return;
    }
    
    // Initialize DOM element references
    conversationsList = document.getElementById('conversationsList');
    messagesList = document.getElementById('messagesList');
    messagesContainer = document.getElementById('messagesContainer');
    welcomeMessage = document.getElementById('welcomeMessage');
    messageInput = document.getElementById('messageInput');
    messageForm = document.getElementById('messageForm');
    messageText = document.getElementById('messageText');
    chatTitle = document.getElementById('chatTitle');
    chatSubtitle = document.getElementById('chatSubtitle');
    deleteConversationBtn = document.getElementById('deleteConversationBtn');
    
    // Debug DOM elements
    console.log('בדיקת אלמנטי DOM:');
    console.log('messageInput:', messageInput);
    console.log('messagesList:', messagesList);
    console.log('welcomeMessage:', welcomeMessage);
    console.log('deleteConversationBtn:', deleteConversationBtn);
    
    // Verify all required elements exist
    if (!messageInput || !messagesList || !welcomeMessage || !deleteConversationBtn) {
        console.error('שגיאה: לא נמצאו כל האלמנטים הנדרשים');
        return;
    }
    
    // Set initial UI state
    resetUIState();
    
    setupNavigation();
    loadConversations();
    
    // Set up message form
    if (messageForm) {
        messageForm.addEventListener('submit', sendMessage);
    }
    
    // Set up auto-refresh every 30 seconds
    refreshInterval = setInterval(() => {
        if (currentConversation) {
            // Use the same logic as selectConversation to get the correct user ID
            let targetUserId = null;
            if (currentConversation._id) {
                targetUserId = currentConversation._id;
            } else if (currentConversation.user && currentConversation.user._id) {
                targetUserId = currentConversation.user._id;
            } else if (currentConversation.userId) {
                targetUserId = currentConversation.userId;
            }
            
            if (targetUserId) {
                loadMessages(targetUserId);
            }
        }
    }, 30000);
    
    console.log('דף שיחות הותחל בהצלחה!');
}

/**
 * Resets the UI to initial state (no conversation selected)
 */
function resetUIState() {
    console.log('מאפס מצב UI...');
    
    // Reset current conversation
    currentConversation = null;
    
    // Hide delete button and show welcome message
    if (deleteConversationBtn) {
        deleteConversationBtn.style.display = 'none';
        console.log('הסתרתי כפתור מחיקה');
    }
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
    
    // Clear any active conversation highlighting
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('bg-light');
    });
    
    console.log('מצב UI אופס בהצלחה');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeConversations); 