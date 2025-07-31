/**
 * Home Page Component for Babysitter Finder SPA
 * Contains authentication forms and landing page content
 */

const HomePage = {
    /**
     * Render the home page
     */
    render(container) {
        console.log('Rendering home page...');
        
        container.innerHTML = this.getTemplate();
        this.setupEventListeners();
        this.setupGeolocation();
        
        // Check if user should see login or register form based on URL hash
        this.handleInitialHash();
    },

    /**
     * Get the HTML template for the home page
     */
    getTemplate() {
        return `
            <!-- Hero Section -->
            <section class="hero-section py-5">
                <article class="container text-center">
                    <h1 class="display-4 mb-4">מצאו בייביסיטר אמין ומקצועי</h1>
                    <p class="lead mb-4">חברו בין הורים לבייביסיטרים מנוסים בישראל</p>
                    
                    <section class="auth-container bg-white shadow-lg">
                        <!-- Authentication Tabs -->
                        <section class="auth-tabs">
                            <button class="auth-tab active" onclick="switchTab('login')">
                                <i class="bi bi-box-arrow-in-right me-2"></i>התחברות
                            </button>
                            <button class="auth-tab" onclick="switchTab('register')">
                                <i class="bi bi-person-plus me-2"></i>הרשמה
                            </button>
                        </section>
                        
                        <section class="auth-content">
                            <!-- Login Form -->
                            <form id="loginForm" class="auth-form active">
                                <header class="text-center mb-4">
                                    <h3 class="text-primary mb-2">ברוכים הבאים!</h3>
                                    <p class="text-muted">התחברו לחשבון שלכם</p>
                                </header>
                                
                                <section class="row g-3">
                                    <section class="col-12">
                                        <label class="form-label"><i class="bi bi-envelope me-2"></i>אימייל</label>
                                        <input type="email" class="form-control" name="email" required>
                                    </section>
                                    
                                    <section class="col-12">
                                        <label class="form-label"><i class="bi bi-lock me-2"></i>סיסמה</label>
                                        <input type="password" class="form-control" name="password" required>
                                    </section>
                                    
                                    <section id="loginMessage" class="col-12 text-center"></section>
                                    
                                    <section class="col-12 text-center">
                                        <button type="submit" class="btn btn-primary btn-lg px-5 py-3">
                                            <i class="bi bi-box-arrow-in-right me-2"></i>התחברות
                                        </button>
                                    </section>
                                </section>
                            </form>
                            
                            <!-- Registration Form -->
                            <form id="registerForm" class="auth-form">
                                <header class="text-center mb-4">
                                    <h3 class="text-primary mb-2">הצטרפו לקהילה שלנו</h3>
                                    <p class="text-muted">הרשמה מהירה ופשוטה</p>
                                </header>
                                
                                <section class="row g-3">
                                    <!-- User Type -->
                                    <section class="col-md-6">
                                        <label class="form-label"><i class="bi bi-person-badge me-2"></i>סוג משתמש</label>
                                        <select class="form-select" id="userType" name="userType" required>
                                            <option value="parent">👥 הורה</option>
                                            <option value="babysitter">👶 ביביסיטר</option>
                                        </select>
                                    </section>
                                    
                                    <!-- First Name -->
                                    <section class="col-md-6">
                                        <label class="form-label"><i class="bi bi-person me-2"></i>שם פרטי</label>
                                        <input type="text" class="form-control" name="firstName" required>
                                    </section>
                                    
                                    <!-- Last Name -->
                                    <section class="col-md-6">
                                        <label class="form-label"><i class="bi bi-person me-2"></i>שם משפחה</label>
                                        <input type="text" class="form-control" name="lastName" required>
                                    </section>
                                    
                                    <!-- Email -->
                                    <section class="col-md-6">
                                        <label class="form-label"><i class="bi bi-envelope me-2"></i>אימייל</label>
                                        <input type="email" class="form-control" name="email" required>
                                    </section>
                                    
                                    <!-- Password -->
                                    <section class="col-md-6">
                                        <label class="form-label"><i class="bi bi-lock me-2"></i>סיסמה</label>
                                        <input type="password" class="form-control" name="password" required minlength="6">
                                    </section>
                                    
                                    <!-- Phone -->
                                    <section class="col-md-6">
                                        <label class="form-label"><i class="bi bi-telephone me-2"></i>טלפון</label>
                                        <input type="text" class="form-control" name="phone" required>
                                    </section>
                                    
                                    <!-- City -->
                                    <section class="col-md-6">
                                        <label class="form-label"><i class="bi bi-geo-alt me-2"></i>עיר</label>
                                        <input type="text" class="form-control" name="city" id="cityInput" required>
                                        <button type="button" class="btn btn-outline-primary mt-2" id="detectLocationBtn">
                                            <i class="bi bi-geo-alt me-1"></i>זיהוי אוטומטי
                                        </button>
                                        <small class="form-text text-muted">לחצו על הכפתור לזיהוי אוטומטי של העיר</small>
                                    </section>
                                    
                                    <!-- Babysitter Fields -->
                                    <section id="babysitterFields" style="display: none;">
                                        <hr class="my-3">
                                        <h6 class="text-primary mb-3"><i class="bi bi-star me-2"></i>פרטי ביביסיטר</h6>
                                        <section class="row g-3">
                                            <section class="col-md-6">
                                                <label class="form-label"><i class="bi bi-currency-dollar me-2"></i>מחיר לשעה (₪)</label>
                                                <input type="number" class="form-control" name="hourlyRate" min="20" max="200">
                                            </section>
                                            <section class="col-md-6">
                                                <label class="form-label"><i class="bi bi-award me-2"></i>ניסיון</label>
                                                <select class="form-select" name="experience">
                                                    <option value="beginner">מתחיל</option>
                                                    <option value="intermediate">בינוני</option>
                                                    <option value="expert">מומחה</option>
                                                </select>
                                            </section>
                                            <section class="col-12">
                                                <label class="form-label"><i class="bi bi-chat-text me-2"></i>תיאור קצר</label>
                                                <textarea class="form-control" name="description" maxlength="500" rows="2" placeholder="ספרו על עצמכם..."></textarea>
                                            </section>
                                        </section>
                                    </section>
                                    
                                    <!-- Message Area -->
                                    <section id="registerMessage" class="col-12 text-center"></section>
                                    
                                    <!-- Submit Button -->
                                    <section class="col-12 text-center">
                                        <button type="submit" class="btn btn-primary btn-lg px-5 py-3">
                                            <i class="bi bi-person-plus me-2"></i>הרשמה למערכת
                                        </button>
                                    </section>
                                </section>
                            </form>
                        </section>
                    </section>
                </article>
            </section>

            <!-- Features Section -->
            <section class="features-section py-5">
                <article class="container">
                    <h2 class="text-center mb-5">למה לבחור ב-Babysitter Finder?</h2>
                    
                    <section class="row g-4">
                        <article class="col-md-4">
                            <section class="feature-card text-center p-4">
                                <i class="bi bi-shield-check display-4 text-primary mb-3"></i>
                                <h3>בדוק ואמין</h3>
                                <p>כל הבייביסיטרים עוברים בדיקות רקע ואימות זהות</p>
                            </section>
                        </article>
                        
                        <article class="col-md-4">
                            <section class="feature-card text-center p-4">
                                <i class="bi bi-clock display-4 text-primary mb-3"></i>
                                <h3>זמינות מיידית</h3>
                                <p>מצאו בייביסיטר זמין תוך דקות, 24/7</p>
                            </section>
                        </article>
                        
                        <article class="col-md-4">
                            <section class="feature-card text-center p-4">
                                <i class="bi bi-chat-dots display-4 text-primary mb-3"></i>
                                <h3>תקשורת ישירה</h3>
                                <p>שוחחו ישירות עם בייביסיטרים דרך הצ'אט</p>
                            </section>
                        </article>
                    </section>
                </article>
            </section>

            <!-- How It Works Section -->
            <section class="how-it-works-section bg-light py-5">
                <article class="container">
                    <h2 class="text-center mb-5">איך זה עובד?</h2>
                    
                    <section class="row g-4">
                        <article class="col-md-4">
                            <section class="step-card text-center">
                                <section class="step-number bg-primary text-white rounded-circle mx-auto mb-3">1</section>
                                <h4>הרשמה</h4>
                                <p>הירשמו כהורים או בייביסיטרים</p>
                            </section>
                        </article>
                        
                        <article class="col-md-4">
                            <section class="step-card text-center">
                                <section class="step-number bg-primary text-white rounded-circle mx-auto mb-3">2</section>
                                <h4>חיפוש</h4>
                                <p>חפשו בייביסיטר לפי מיקום ומחיר</p>
                            </section>
                        </article>
                        
                        <article class="col-md-4">
                            <section class="step-card text-center">
                                <section class="step-number bg-primary text-white rounded-circle mx-auto mb-3">3</section>
                                <h4>תקשורת</h4>
                                <p>תקשרו עם הבייביסיטר דרך הצ'אט</p>
                            </section>
                        </article>
                    </section>
                </article>
            </section>
        `;
    },

    /**
     * Setup event listeners for the forms
     */
    setupEventListeners() {
        console.log('Setting up home page event listeners...');
        
        // Setup login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }
        
        // Setup registration form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegistration.bind(this));
        }
        
        // Setup user type change
        const userTypeSelect = document.getElementById('userType');
        if (userTypeSelect) {
            userTypeSelect.addEventListener('change', this.toggleBabysitterFields.bind(this));
        }
        
        // Make tab switching function global
        window.switchTab = this.switchTab.bind(this);
    },

    /**
     * Setup geolocation functionality
     */
    setupGeolocation() {
        const detectLocationBtn = document.getElementById('detectLocationBtn');
        const cityInput = document.getElementById('cityInput');
        
        if (detectLocationBtn && cityInput && window.geolocationService) {
            detectLocationBtn.addEventListener('click', async () => {
                console.log('Location button clicked!');
                const originalText = detectLocationBtn.innerHTML;
                try {
                    detectLocationBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> מזהה...';
                    detectLocationBtn.disabled = true;
                    
                    await window.geolocationService.autoDetectCity(cityInput);
                    console.log('Geolocation successful!');
                } catch (error) {
                    console.error('Error detecting location:', error);
                    window.showMessage('שגיאה בזיהוי המיקום. אנא הזינו את העיר ידנית.', 'warning');
                } finally {
                    detectLocationBtn.innerHTML = originalText;
                    detectLocationBtn.disabled = false;
                }
            });
        }
    },

    /**
     * Handle initial URL hash
     */
    handleInitialHash() {
        const hash = window.location.hash;
        if (hash === '#register') {
            this.switchTab('register');
        } else if (hash === '#login') {
            this.switchTab('login');
        }
    },

    /**
     * Switch between login and register tabs
     */
    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Update tab buttons
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        
        // Activate selected tab
        const selectedTab = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        const selectedForm = document.getElementById(`${tabName}Form`);
        if (selectedForm) {
            selectedForm.classList.add('active');
        }
        
        // Clear messages
        this.clearMessages();
    },

    /**
     * Clear form messages
     */
    clearMessages() {
        const messages = ['loginMessage', 'registerMessage'];
        messages.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = '';
            }
        });
    },

    /**
     * Toggle babysitter fields based on user type
     */
    toggleBabysitterFields() {
        const userType = document.getElementById('userType').value;
        const babysitterFields = document.getElementById('babysitterFields');
        
        if (babysitterFields) {
            if (userType === 'babysitter') {
                babysitterFields.style.display = 'block';
                setTimeout(() => {
                    babysitterFields.style.opacity = '1';
                    babysitterFields.style.transition = 'opacity 0.3s ease';
                }, 10);
            } else {
                babysitterFields.style.display = 'none';
            }
        }
    },

    /**
     * Handle login form submission
     */
    async handleLogin(event) {
        event.preventDefault();
        console.log('Handling login...');
        
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        if (!this.validateForm('loginForm')) {
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>מתחבר...';
        submitBtn.disabled = true;
        
        try {
            const response = await window.apiService.login(data);
            console.log('Login successful:', response);
            
            // Store user data
            localStorage.setItem('token', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));
            
            // Show success message
            this.showFormMessage('loginMessage', 'התחברות הצליחה! מעביר לפרופיל שלך...', 'success');
            
            // Clear form
            form.reset();
            
            // Dispatch login event
            window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: response.user }));
            
        } catch (error) {
            console.error('Login error:', error);
            this.showFormMessage('loginMessage', 'שגיאה בהתחברות. אנא בדקו את הפרטים ונסו שוב.', 'danger');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    },

    /**
     * Handle registration form submission
     */
    async handleRegistration(event) {
        event.preventDefault();
        console.log('Handling registration...');
        
        const form = event.target;
        const formData = new FormData(form);
        const userType = formData.get('userType');
        
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            password: formData.get('password'),
            phone: formData.get('phone'),
            userType: userType,
            city: formData.get('city')
        };
        
        // Add babysitter-specific fields
        if (userType === 'babysitter') {
            data.hourlyRate = formData.get('hourlyRate');
            data.experience = formData.get('experience');
            data.description = formData.get('description');
        }
        
        if (!this.validateForm('registerForm')) {
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>מעבד...';
        submitBtn.disabled = true;
        
        try {
            const response = await window.apiService.register(data);
            console.log('Registration successful:', response);
            
            // Store user data
            localStorage.setItem('token', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));
            
            // Show success message
            this.showFormMessage('registerMessage', 'הרשמה הצליחה! מתחבר אוטומטית...', 'success');
            
            // Clear form
            form.reset();
            
            // Dispatch login event
            window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: response.user }));
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showFormMessage('registerMessage', 'שגיאה בהרשמה. אנא בדקו את הפרטים ונסו שוב.', 'danger');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    },

    /**
     * Validate form inputs
     */
    validateForm(formId) {
        console.log('Validating form:', formId);
        const form = document.getElementById(formId);
        if (!form) {
            console.error('Form not found:', formId);
            return false;
        }
        
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                console.log('Empty field:', input.name);
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });
        
        console.log('Form validity:', isValid);
        return isValid;
    },

    /**
     * Show form message
     */
    showFormMessage(elementId, message, type = 'info') {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `
                <div class="alert alert-${type} alert-dismissible fade show">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
        }
    }
};

// Export the component
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomePage;
} else {
    window.HomePage = HomePage;
}

console.log('HomePage component loaded successfully!');