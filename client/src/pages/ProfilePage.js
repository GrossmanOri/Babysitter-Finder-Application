/**
 * Profile Page Component for Babysitter Finder SPA
 * Displays and manages user profile information
 */

const ProfilePage = {
    /**
     * Render the profile page
     */
    render(container) {
        console.log('Rendering profile page...');
        
        container.innerHTML = this.getTemplate();
        this.loadUserData();
        this.setupEventListeners();
    },

    /**
     * Get the HTML template for the profile page
     */
    getTemplate() {
        return `
            <div class="container my-5">
                <!-- Profile Header -->
                <section class="profile-header mb-4">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h1 id="userName" class="display-6">טוען...</h1>
                            <p id="userEmail" class="text-muted mb-0">טוען...</p>
                            <p id="userRole" class="text-primary mb-0">טוען...</p>
                        </div>
                        <div class="col-md-4 text-md-end">
                            <button class="btn btn-outline-primary me-2" onclick="editProfile()">
                                <i class="bi bi-pencil me-1"></i>ערוך פרופיל
                            </button>
                            <button class="btn btn-outline-danger" onclick="deleteAccount()">
                                <i class="bi bi-trash me-1"></i>מחק חשבון
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Profile Content -->
                <div class="row">
                    <!-- User Information -->
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0"><i class="bi bi-person me-2"></i>פרטים אישיים</h5>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-sm-6">
                                        <label class="form-label">שם פרטי</label>
                                        <input type="text" class="form-control" id="firstName" readonly>
                                    </div>
                                    <div class="col-sm-6">
                                        <label class="form-label">שם משפחה</label>
                                        <input type="text" class="form-control" id="lastName" readonly>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label">אימייל</label>
                                        <input type="email" class="form-control" id="email" readonly>
                                    </div>
                                    <div class="col-sm-6">
                                        <label class="form-label">טלפון</label>
                                        <input type="text" class="form-control" id="phone" readonly>
                                    </div>
                                    <div class="col-sm-6">
                                        <label class="form-label">עיר</label>
                                        <input type="text" class="form-control" id="city" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Babysitter Information -->
                    <div class="col-md-6" id="babysitterInfo" style="display: none;">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0"><i class="bi bi-star me-2"></i>פרטי ביביסיטר</h5>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-sm-6">
                                        <label class="form-label">מחיר לשעה (₪)</label>
                                        <input type="number" class="form-control" id="hourlyRate" readonly>
                                    </div>
                                    <div class="col-sm-6">
                                        <label class="form-label">ניסיון</label>
                                        <input type="text" class="form-control" id="experience" readonly>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label">תיאור</label>
                                        <textarea class="form-control" id="description" rows="3" readonly></textarea>
                                    </div>
                                    <div class="col-12">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="isAvailable" disabled>
                                            <label class="form-check-label" for="isAvailable">
                                                זמין לעבודה
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Statistics -->
                    <div class="col-md-6 mt-4" id="statisticsCard">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0"><i class="bi bi-graph-up me-2"></i>סטטיסטיקות</h5>
                            </div>
                            <div class="card-body">
                                <div class="row text-center">
                                    <div class="col-6">
                                        <div class="border-end">
                                            <h4 id="totalMessages" class="text-primary">0</h4>
                                            <small class="text-muted">הודעות</small>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <h4 id="totalConversations" class="text-success">0</h4>
                                        <small class="text-muted">שיחות</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="col-md-6 mt-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0"><i class="bi bi-lightning me-2"></i>פעולות מהירות</h5>
                            </div>
                            <div class="card-body">
                                <div class="d-grid gap-2">
                                    <a href="#" data-route="/search" class="btn btn-primary">
                                        <i class="bi bi-search me-2"></i>חפש בייביסיטרים
                                    </a>
                                    <a href="#" data-route="/conversations" class="btn btn-outline-primary">
                                        <i class="bi bi-chat-dots me-2"></i>השיחות שלי
                                    </a>
                                    <button class="btn btn-outline-secondary" onclick="changePassword()">
                                        <i class="bi bi-lock me-2"></i>שנה סיסמה
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Loading indicator -->
                <div id="profileLoading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">טוען...</span>
                    </div>
                    <p class="mt-2">טוען נתוני פרופיל...</p>
                </div>

                <!-- Error message -->
                <div id="profileError" class="alert alert-danger d-none" role="alert">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    <span id="errorMessage">שגיאה בטעינת הפרופיל</span>
                </div>
            </div>
        `;
    },

    /**
     * Load user data from API
     */
    async loadUserData() {
        console.log('Loading user profile data...');
        
        const loadingElement = document.getElementById('profileLoading');
        const errorElement = document.getElementById('profileError');
        const profileContent = document.querySelector('.profile-header').parentElement;
        
        try {
            // Show loading
            if (loadingElement) loadingElement.style.display = 'block';
            if (errorElement) errorElement.classList.add('d-none');
            
            // Get user profile from API
            const response = await window.apiService.getUserProfile();
            const user = response.data || response.user;
            
            console.log('User profile loaded:', user);
            
            // Update UI with user data
            this.populateUserData(user);
            
            // Load statistics
            await this.loadUserStatistics();
            
            // Hide loading
            if (loadingElement) loadingElement.style.display = 'none';
            
        } catch (error) {
            console.error('Error loading user profile:', error);
            
            // Hide loading and show error
            if (loadingElement) loadingElement.style.display = 'none';
            if (errorElement) {
                errorElement.classList.remove('d-none');
                const errorMessage = document.getElementById('errorMessage');
                if (errorMessage) {
                    errorMessage.textContent = 'שגיאה בטעינת נתוני הפרופיל. אנא נסו שוב.';
                }
            }
        }
    },

    /**
     * Populate user data in the form
     */
    populateUserData(user) {
        console.log('Populating user data:', user);
        
        // Update header
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userRole = document.getElementById('userRole');
        
        if (userName) userName.textContent = `${user.firstName} ${user.lastName}`;
        if (userEmail) userEmail.textContent = user.email;
        if (userRole) {
            userRole.textContent = user.userType === 'babysitter' ? 'ביביסיטר' : 'הורה';
        }
        
        // Update form fields
        const fields = ['firstName', 'lastName', 'email', 'phone', 'city'];
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element && user[field]) {
                element.value = user[field];
            }
        });
        
        // Update babysitter fields if applicable
        if (user.userType === 'babysitter' && user.babysitter) {
            const babysitterInfo = document.getElementById('babysitterInfo');
            if (babysitterInfo) {
                babysitterInfo.style.display = 'block';
                
                const hourlyRate = document.getElementById('hourlyRate');
                const experience = document.getElementById('experience');
                const description = document.getElementById('description');
                const isAvailable = document.getElementById('isAvailable');
                
                if (hourlyRate) hourlyRate.value = user.babysitter.hourlyRate || '';
                if (experience) experience.value = user.babysitter.experience || '';
                if (description) description.value = user.babysitter.description || '';
                if (isAvailable) isAvailable.checked = user.babysitter.isAvailable || false;
            }
        }
    },

    /**
     * Load user statistics
     */
    async loadUserStatistics() {
        try {
            const response = await window.apiService.getUserStats();
            const stats = response.data;
            
            const totalMessages = document.getElementById('totalMessages');
            const totalConversations = document.getElementById('totalConversations');
            
            if (totalMessages) totalMessages.textContent = stats.totalMessages || 0;
            if (totalConversations) totalConversations.textContent = stats.totalConversations || 0;
            
        } catch (error) {
            console.error('Error loading user statistics:', error);
            // Don't show error for statistics, just log it
        }
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        console.log('Setting up profile page event listeners...');
        
        // Make functions globally available
        window.editProfile = this.editProfile.bind(this);
        window.deleteAccount = this.deleteAccount.bind(this);
        window.changePassword = this.changePassword.bind(this);
    },

    /**
     * Edit profile functionality
     */
    editProfile() {
        console.log('Edit profile clicked');
        window.showMessage('עריכת פרופיל תמומש בגרסה עתידית', 'info');
    },

    /**
     * Delete account functionality
     */
    async deleteAccount() {
        if (!confirm('האם אתם בטוחים שברצונכם למחוק את החשבון? פעולה זו לא ניתנת לביטול.')) {
            return;
        }
        
        try {
            await window.apiService.deleteUserAccount();
            window.showMessage('החשבון נמחק בהצלחה', 'success');
            
            // Logout user
            window.logout();
        } catch (error) {
            console.error('Error deleting account:', error);
            window.showMessage('שגיאה במחיקת החשבון. אנא נסו שוב.', 'danger');
        }
    },

    /**
     * Change password functionality
     */
    changePassword() {
        console.log('Change password clicked');
        window.showMessage('שינוי סיסמה יממומש בגרסה עתידית', 'info');
    }
};

// Export the component
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfilePage;
} else {
    window.ProfilePage = ProfilePage;
}

console.log('ProfilePage component loaded successfully!');