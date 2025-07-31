/**
 * Centralized API Service for Babysitter Finder
 * Handles all communication with the server API
 */

class ApiService {
    constructor() {
        this.baseUrl = this.getBaseUrl();
        console.log('ApiService initialized with base URL:', this.baseUrl);
    }

    /**
     * Get the base API URL based on environment
     */
    getBaseUrl() {
        const hostname = window.location.hostname;
        const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
        
        return isLocal 
            ? 'http://localhost:3000/api' 
            : 'https://babysitter-finder-application.onrender.com/api';
    }

    /**
     * Get authentication headers
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    /**
     * Make HTTP request with error handling
     */
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        console.log('Making request to:', url);

        const defaultOptions = {
            method: 'GET',
            headers: this.getHeaders()
        };

        const finalOptions = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, finalOptions);
            console.log('Response status:', response.status);

            if (!response.ok) {
                if (response.status === 401) {
                    this.handleUnauthorized();
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data);
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    /**
     * Handle unauthorized responses
     */
    handleUnauthorized() {
        console.log('Unauthorized access - clearing local storage');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('user');
        
        // Dispatch logout event
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
    }

    // ==================== AUTH ENDPOINTS ====================

    /**
     * User registration
     */
    async register(userData) {
        console.log('Registering user:', userData);
        return this.makeRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    /**
     * User login
     */
    async login(credentials) {
        console.log('Logging in user:', credentials.email);
        return this.makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    /**
     * Verify user token
     */
    async verifyToken() {
        console.log('Verifying token...');
        return this.makeRequest('/auth/verify');
    }

    /**
     * Change password
     */
    async changePassword(passwordData) {
        console.log('Changing password...');
        return this.makeRequest('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify(passwordData)
        });
    }

    /**
     * Logout user
     */
    async logout() {
        console.log('Logging out user...');
        return this.makeRequest('/auth/logout', {
            method: 'POST'
        });
    }

    // ==================== USER ENDPOINTS ====================

    /**
     * Get current user profile
     */
    async getUserProfile() {
        console.log('Getting user profile...');
        return this.makeRequest('/users/profile');
    }

    /**
     * Update user profile
     */
    async updateUserProfile(profileData) {
        console.log('Updating user profile:', profileData);
        return this.makeRequest('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    /**
     * Get user by ID
     */
    async getUserById(userId) {
        console.log('Getting user by ID:', userId);
        return this.makeRequest(`/users/${userId}`);
    }

    /**
     * Delete user account
     */
    async deleteUserAccount() {
        console.log('Deleting user account...');
        return this.makeRequest('/users/profile', {
            method: 'DELETE'
        });
    }

    /**
     * Get user statistics
     */
    async getUserStats() {
        console.log('Getting user stats...');
        return this.makeRequest('/users/stats');
    }

    /**
     * Update password
     */
    async updatePassword(passwordData) {
        console.log('Updating password...');
        return this.makeRequest('/users/password', {
            method: 'PUT',
            body: JSON.stringify(passwordData)
        });
    }

    // ==================== BABYSITTER ENDPOINTS ====================

    /**
     * Search babysitters
     */
    async searchBabysitters(searchParams = {}) {
        console.log('Searching babysitters:', searchParams);
        const queryString = new URLSearchParams(searchParams).toString();
        const endpoint = queryString ? `/babysitters?${queryString}` : '/babysitters';
        return this.makeRequest(endpoint);
    }

    /**
     * Get babysitter profile
     */
    async getBabysitterProfile(babysitterId) {
        console.log('Getting babysitter profile:', babysitterId);
        return this.makeRequest(`/babysitters/${babysitterId}`);
    }

    // ==================== MESSAGE ENDPOINTS ====================

    /**
     * Get conversations
     */
    async getConversations() {
        console.log('Getting conversations...');
        return this.makeRequest('/messages/conversations');
    }

    /**
     * Get messages for a conversation
     */
    async getMessages(conversationId) {
        console.log('Getting messages for conversation:', conversationId);
        return this.makeRequest(`/messages/${conversationId}`);
    }

    /**
     * Send message
     */
    async sendMessage(messageData) {
        console.log('Sending message:', messageData);
        return this.makeRequest('/messages', {
            method: 'POST',
            body: JSON.stringify(messageData)
        });
    }

    /**
     * Mark messages as read
     */
    async markMessagesAsRead(conversationId) {
        console.log('Marking messages as read for conversation:', conversationId);
        return this.makeRequest(`/messages/${conversationId}/read`, {
            method: 'PUT'
        });
    }

    // ==================== HEALTH CHECK ====================

    /**
     * Health check
     */
    async healthCheck() {
        console.log('Performing health check...');
        return this.makeRequest('/health');
    }
}

// Create global API service instance
window.apiService = new ApiService();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiService;
}

console.log('ApiService loaded successfully!');