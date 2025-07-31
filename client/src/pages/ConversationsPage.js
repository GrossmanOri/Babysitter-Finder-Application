/**
 * Conversations Page Component for Babysitter Finder SPA
 * Displays user's conversations
 */

const ConversationsPage = {
    /**
     * Render the conversations page
     */
    render(container) {
        console.log('Rendering conversations page...');
        container.innerHTML = this.getTemplate();
        this.loadConversations();
    },

    /**
     * Get the HTML template for the conversations page
     */
    getTemplate() {
        return `
            <div class="container my-5">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1>
                        <i class="bi bi-chat-dots me-2"></i>
                        השיחות שלי
                    </h1>
                    <button class="btn btn-primary" onclick="startNewConversation()">
                        <i class="bi bi-plus-circle me-1"></i>שיחה חדשה
                    </button>
                </div>

                <!-- Conversations List -->
                <div id="conversationsList">
                    <!-- Conversations will be loaded here -->
                </div>

                <!-- Loading -->
                <div id="conversationsLoading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">טוען שיחות...</span>
                    </div>
                    <p class="mt-2">טוען שיחות...</p>
                </div>

                <!-- Empty State -->
                <div id="emptyState" class="text-center py-5 d-none">
                    <i class="bi bi-chat-square-dots display-4 text-muted"></i>
                    <h4 class="mt-3">אין שיחות עדיין</h4>
                    <p class="text-muted mb-4">התחילו שיחה חדשה עם בייביסיטר</p>
                    <button class="btn btn-primary" onclick="startNewConversation()">
                        <i class="bi bi-plus-circle me-1"></i>התחל שיחה
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Load conversations from API
     */
    async loadConversations() {
        console.log('Loading conversations...');
        
        const loadingElement = document.getElementById('conversationsLoading');
        const listElement = document.getElementById('conversationsList');
        const emptyStateElement = document.getElementById('emptyState');
        
        try {
            // Show loading
            if (loadingElement) loadingElement.style.display = 'block';
            if (emptyStateElement) emptyStateElement.classList.add('d-none');
            
            // Make API call
            const response = await window.apiService.getConversations();
            const conversations = response.data || response.conversations || [];
            
            console.log('Conversations loaded:', conversations);
            
            // Hide loading
            if (loadingElement) loadingElement.style.display = 'none';
            
            // Display conversations
            this.displayConversations(conversations);
            
        } catch (error) {
            console.error('Error loading conversations:', error);
            
            // Hide loading
            if (loadingElement) loadingElement.style.display = 'none';
            
            // Show error or empty state
            if (listElement) {
                listElement.innerHTML = `
                    <div class="alert alert-danger text-center">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        שגיאה בטעינת השיחות. אנא נסו שוב.
                    </div>
                `;
            }
        }
    },

    /**
     * Display conversations
     */
    displayConversations(conversations) {
        const listElement = document.getElementById('conversationsList');
        const emptyStateElement = document.getElementById('emptyState');
        
        if (!listElement) return;
        
        if (conversations.length === 0) {
            listElement.innerHTML = '';
            if (emptyStateElement) emptyStateElement.classList.remove('d-none');
            return;
        }
        
        const conversationsHTML = conversations.map(conversation => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h5 class="card-title mb-1">
                                ${conversation.otherUser?.firstName} ${conversation.otherUser?.lastName}
                            </h5>
                            <p class="card-text text-muted mb-1">
                                ${conversation.lastMessage?.content || 'אין הודעות עדיין'}
                            </p>
                            <small class="text-muted">
                                <i class="bi bi-clock me-1"></i>
                                ${this.formatDate(conversation.lastMessage?.createdAt)}
                            </small>
                        </div>
                        <div class="col-md-4 text-md-end">
                            ${conversation.unreadCount > 0 ? `
                                <span class="badge bg-primary rounded-pill mb-2">
                                    ${conversation.unreadCount} חדשות
                                </span><br>
                            ` : ''}
                            <button class="btn btn-outline-primary" onclick="openConversation('${conversation._id}')">
                                <i class="bi bi-chat-dots me-1"></i>פתח שיחה
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        listElement.innerHTML = conversationsHTML;
        
        // Make functions globally available
        window.openConversation = this.openConversation.bind(this);
        window.startNewConversation = this.startNewConversation.bind(this);
    },

    /**
     * Format date for display
     */
    formatDate(dateString) {
        if (!dateString) return 'לא צוין';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'היום';
        } else if (diffDays === 2) {
            return 'אתמול';
        } else if (diffDays <= 7) {
            return `לפני ${diffDays} ימים`;
        } else {
            return date.toLocaleDateString('he-IL');
        }
    },

    /**
     * Open conversation
     */
    openConversation(conversationId) {
        console.log('Opening conversation:', conversationId);
        window.router.navigate(`/chat/${conversationId}`);
    },

    /**
     * Start new conversation
     */
    startNewConversation() {
        console.log('Starting new conversation');
        window.showMessage('התחלת שיחה חדשה תמומש בגרסה עתידית', 'info');
    }
};

// Export the component
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConversationsPage;
} else {
    window.ConversationsPage = ConversationsPage;
}

console.log('ConversationsPage component loaded successfully!');