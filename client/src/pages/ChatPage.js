/**
 * Chat Page Component for Babysitter Finder SPA
 * Handles individual chat conversations
 */

const ChatPage = {
    /**
     * Render the chat page
     */
    render(container, chatId) {
        console.log('Rendering chat page for conversation:', chatId);
        this.chatId = chatId;
        container.innerHTML = this.getTemplate();
        this.setupEventListeners();
        this.loadMessages();
    },

    /**
     * Get the HTML template for the chat page
     */
    getTemplate() {
        return `
            <div class="container-fluid h-100 py-3">
                <div class="row h-100">
                    <div class="col-12">
                        <!-- Chat Header -->
                        <div class="card mb-3">
                            <div class="card-body py-2">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="d-flex align-items-center">
                                        <button class="btn btn-outline-secondary btn-sm me-3" onclick="goBack()">
                                            <i class="bi bi-arrow-right"></i>
                                        </button>
                                        <div>
                                            <h6 class="mb-0" id="chatUserName">טוען...</h6>
                                            <small class="text-muted" id="chatUserStatus">מחובר</small>
                                        </div>
                                    </div>
                                    <div>
                                        <button class="btn btn-outline-primary btn-sm">
                                            <i class="bi bi-telephone"></i>
                                        </button>
                                        <button class="btn btn-outline-info btn-sm">
                                            <i class="bi bi-info-circle"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Messages Container -->
                        <div class="card flex-grow-1 d-flex flex-column" style="height: calc(100vh - 200px);">
                            <div class="card-body d-flex flex-column p-0">
                                <!-- Messages Area -->
                                <div class="flex-grow-1 overflow-auto p-3" id="messagesContainer">
                                    <div class="text-center py-5">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">טוען הודעות...</span>
                                        </div>
                                        <p class="mt-2">טוען הודעות...</p>
                                    </div>
                                </div>

                                <!-- Message Input -->
                                <div class="border-top p-3">
                                    <form id="messageForm" class="d-flex gap-2">
                                        <input type="text" 
                                               class="form-control" 
                                               id="messageInput" 
                                               placeholder="הקלידו הודעה..." 
                                               required>
                                        <button type="submit" class="btn btn-primary">
                                            <i class="bi bi-send"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        console.log('Setting up chat page event listeners...');
        
        const messageForm = document.getElementById('messageForm');
        if (messageForm) {
            messageForm.addEventListener('submit', this.handleSendMessage.bind(this));
        }
        
        // Auto-focus message input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.focus();
        }
        
        // Make functions globally available
        window.goBack = this.goBack.bind(this);
    },

    /**
     * Load messages for the conversation
     */
    async loadMessages() {
        console.log('Loading messages for conversation:', this.chatId);
        
        const messagesContainer = document.getElementById('messagesContainer');
        
        try {
            // Make API call to get messages
            const response = await window.apiService.getMessages(this.chatId);
            const messages = response.data || response.messages || [];
            
            console.log('Messages loaded:', messages);
            
            // Display messages
            this.displayMessages(messages);
            
            // Mark messages as read
            await this.markMessagesAsRead();
            
        } catch (error) {
            console.error('Error loading messages:', error);
            
            if (messagesContainer) {
                messagesContainer.innerHTML = `
                    <div class="alert alert-danger text-center">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        שגיאה בטעינת ההודעות. אנא נסו שוב.
                    </div>
                `;
            }
        }
    },

    /**
     * Display messages in the chat
     */
    displayMessages(messages) {
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) return;
        
        if (messages.length === 0) {
            messagesContainer.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="bi bi-chat-square-text display-4"></i>
                    <p class="mt-3">עדיין אין הודעות בשיחה זו</p>
                    <p>התחילו לשוחח!</p>
                </div>
            `;
            return;
        }
        
        const currentUserId = this.getCurrentUserId();
        
        const messagesHTML = messages.map(message => {
            const isMyMessage = message.sender === currentUserId;
            const messageClass = isMyMessage ? 'ms-auto bg-primary text-white' : 'me-auto bg-light';
            const alignClass = isMyMessage ? 'text-end' : 'text-start';
            
            return `
                <div class="mb-3 ${alignClass}">
                    <div class="d-inline-block p-3 rounded ${messageClass}" style="max-width: 70%;">
                        <p class="mb-1">${this.escapeHtml(message.content)}</p>
                        <small class="opacity-75">
                            ${this.formatMessageTime(message.createdAt)}
                        </small>
                    </div>
                </div>
            `;
        }).join('');
        
        messagesContainer.innerHTML = messagesHTML;
        
        // Scroll to bottom
        this.scrollToBottom();
    },

    /**
     * Handle sending a new message
     */
    async handleSendMessage(event) {
        event.preventDefault();
        console.log('Sending message...');
        
        const messageInput = document.getElementById('messageInput');
        const messageContent = messageInput.value.trim();
        
        if (!messageContent) return;
        
        try {
            // Clear input immediately
            messageInput.value = '';
            
            // Add message optimistically to UI
            this.addMessageToUI(messageContent, true);
            
            // Send message to API
            const messageData = {
                conversationId: this.chatId,
                content: messageContent
            };
            
            const response = await window.apiService.sendMessage(messageData);
            console.log('Message sent:', response);
            
            // Could refresh messages here if needed
            
        } catch (error) {
            console.error('Error sending message:', error);
            window.showMessage('שגיאה בשליחת ההודעה. אנא נסו שוב.', 'danger');
            
            // Restore message to input on error
            messageInput.value = messageContent;
        }
    },

    /**
     * Add message to UI optimistically
     */
    addMessageToUI(content, isMyMessage) {
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) return;
        
        const messageClass = isMyMessage ? 'ms-auto bg-primary text-white' : 'me-auto bg-light';
        const alignClass = isMyMessage ? 'text-end' : 'text-start';
        
        const messageHTML = `
            <div class="mb-3 ${alignClass}">
                <div class="d-inline-block p-3 rounded ${messageClass}" style="max-width: 70%;">
                    <p class="mb-1">${this.escapeHtml(content)}</p>
                    <small class="opacity-75">עכשיו</small>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    },

    /**
     * Mark messages as read
     */
    async markMessagesAsRead() {
        try {
            await window.apiService.markMessagesAsRead(this.chatId);
            console.log('Messages marked as read');
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    },

    /**
     * Get current user ID
     */
    getCurrentUserId() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                return user.id || user._id;
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
        return null;
    },

    /**
     * Scroll messages to bottom
     */
    scrollToBottom() {
        const messagesContainer = document.getElementById('messagesContainer');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    },

    /**
     * Format message timestamp
     */
    formatMessageTime(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleTimeString('he-IL', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Go back to conversations
     */
    goBack() {
        console.log('Going back to conversations');
        window.router.navigate('/conversations');
    }
};

// Export the component
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatPage;
} else {
    window.ChatPage = ChatPage;
}

console.log('ChatPage component loaded successfully!');