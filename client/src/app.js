/**
 * Main Application File for Babysitter Finder SPA
 * Sets up routing and initializes the application
 */

console.log('Babysitter Finder App initializing...');

// Page components are loaded globally via script tags

// Application state
let currentUser = null;
let isLoggedIn = false;

/**
 * Initialize the application
 */
function initApp() {
    console.log('Initializing app...');
    
    // Check login status
    checkLoginStatus();
    
    // Setup routes
    setupRoutes();
    
    // Setup navigation
    setupNavigation();
    
    // Setup global event listeners
    setupGlobalEventListeners();
    
    console.log('App initialized successfully!');
}

/**
 * Setup application routes
 */
function setupRoutes() {
    console.log('Setting up routes...');
    
    // Define all routes
    window.router.addRoute('/home', () => loadHomePage());
    window.router.addRoute('/profile', () => loadProfilePage());
    window.router.addRoute('/search', () => loadSearchPage());
    window.router.addRoute('/about', () => loadAboutPage());
    window.router.addRoute('/conversations', () => loadConversationsPage());
    window.router.addRoute('/chat/:id', (path) => loadChatPage(path));
    
    console.log('Routes configured');
}

/**
 * Load home page
 */
function loadHomePage() {
    console.log('Loading home page...');
    updatePageTitle('Babysitter Finder - מציאת בייביסיטר');
    
    const appContainer = document.getElementById('app-content');
    if (!appContainer) return;
    
    // Use global HomePage component
    if (window.HomePage) {
        window.HomePage.render(appContainer);
    } else {
        console.error('HomePage component not loaded');
    }
}

/**
 * Load profile page (authenticated)
 */
function loadProfilePage() {
    console.log('Loading profile page...');
    
    if (!isUserLoggedIn()) {
        showMessage('יש להתחבר כדי לגשת לפרופיל', 'warning');
        window.router.navigate('/home');
        return;
    }
    
    updatePageTitle('הפרופיל שלי - Babysitter Finder');
    
    const appContainer = document.getElementById('app-content');
    if (!appContainer) return;
    
    // Use global ProfilePage component
    if (window.ProfilePage) {
        window.ProfilePage.render(appContainer);
    } else {
        console.error('ProfilePage component not loaded');
    }
}

/**
 * Load search page (authenticated)
 */
function loadSearchPage() {
    console.log('Loading search page...');
    
    if (!isUserLoggedIn()) {
        showMessage('יש להתחבר כדי לחפש בייביסיטרים', 'warning');
        window.router.navigate('/home');
        return;
    }
    
    updatePageTitle('חיפוש בייביסיטר - Babysitter Finder');
    
    const appContainer = document.getElementById('app-content');
    if (!appContainer) return;
    
    // Use global SearchPage component
    if (window.SearchPage) {
        window.SearchPage.render(appContainer);
    } else {
        console.error('SearchPage component not loaded');
    }
}

/**
 * Load about page
 */
function loadAboutPage() {
    console.log('Loading about page...');
    updatePageTitle('אודות - Babysitter Finder');
    
    const appContainer = document.getElementById('app-content');
    if (!appContainer) return;
    
    // Use global AboutPage component
    if (window.AboutPage) {
        window.AboutPage.render(appContainer);
    } else {
        console.error('AboutPage component not loaded');
    }
}

/**
 * Load conversations page (authenticated)
 */
function loadConversationsPage() {
    console.log('Loading conversations page...');
    
    if (!isUserLoggedIn()) {
        showMessage('יש להתחבר כדי לצפות בשיחות', 'warning');
        window.router.navigate('/home');
        return;
    }
    
    updatePageTitle('השיחות שלי - Babysitter Finder');
    
    const appContainer = document.getElementById('app-content');
    if (!appContainer) return;
    
    // Use global ConversationsPage component
    if (window.ConversationsPage) {
        window.ConversationsPage.render(appContainer);
    } else {
        console.error('ConversationsPage component not loaded');
    }
}

/**
 * Load chat page (authenticated)
 */
function loadChatPage(path) {
    console.log('Loading chat page...', path);
    
    if (!isUserLoggedIn()) {
        showMessage('יש להתחבר כדי לצ\'אט', 'warning');
        window.router.navigate('/home');
        return;
    }
    
    const chatId = path.split('/')[2];
    updatePageTitle(`צ'אט - Babysitter Finder`);
    
    const appContainer = document.getElementById('app-content');
    if (!appContainer) return;
    
    // Use global ChatPage component
    if (window.ChatPage) {
        window.ChatPage.render(appContainer, chatId);
    } else {
        console.error('ChatPage component not loaded');
    }
}

/**
 * Check if user is logged in
 */
function isUserLoggedIn() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    return !!(token && userData);
}

/**
 * Check login status and update global state
 */
function checkLoginStatus() {
    console.log('Checking login status...');
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData') || localStorage.getItem('user');
    
    if (token && userData) {
        try {
            currentUser = JSON.parse(userData);
            isLoggedIn = true;
            console.log('User is logged in:', currentUser.firstName || currentUser.name);
            updateNavigationForLoggedInUser();
        } catch (error) {
            console.error('Error parsing user data:', error);
            logout();
        }
    } else {
        console.log('User is not logged in');
        isLoggedIn = false;
        currentUser = null;
        updateNavigationForGuestUser();
    }
}

/**
 * Update navigation for logged in user
 */
function updateNavigationForLoggedInUser() {
    console.log('Updating navigation for logged in user...');
    
    const navMenu = document.getElementById('navigationMenu');
    const authButtons = document.getElementById('authButtons');
    
    if (navMenu) {
        navMenu.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="#" data-route="/search">חיפוש בייביסיטר</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" data-route="/conversations">השיחות שלי</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" data-route="/about">אודות</a>
            </li>
        `;
    }
    
    if (authButtons) {
        authButtons.innerHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle me-1"></i>${currentUser.firstName || currentUser.name}
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" data-route="/profile">
                        <i class="bi bi-person me-2"></i>הפרופיל שלי
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()">
                        <i class="bi bi-box-arrow-right me-2"></i>התנתק
                    </a></li>
                </ul>
            </li>
        `;
    }
}

/**
 * Update navigation for guest user
 */
function updateNavigationForGuestUser() {
    console.log('Updating navigation for guest user...');
    
    const navMenu = document.getElementById('navigationMenu');
    const authButtons = document.getElementById('authButtons');
    
    if (navMenu) {
        navMenu.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="#" data-route="/about">אודות</a>
            </li>
        `;
    }
    
    if (authButtons) {
        authButtons.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="showLoginForm()">התחברות</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="showRegisterForm()">הרשמה</a>
            </li>
        `;
    }
}

/**
 * Setup navigation
 */
function setupNavigation() {
    console.log('Setting up navigation...');
    
    // Setup logo link
    const logoLink = document.querySelector('.navbar-brand');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) {
                window.router.navigate('/profile');
            } else {
                window.router.navigate('/home');
            }
        });
    }
}

/**
 * Setup global event listeners
 */
function setupGlobalEventListeners() {
    console.log('Setting up global event listeners...');
    
    // Listen for authentication state changes
    window.addEventListener('userLoggedIn', (e) => {
        console.log('User logged in event received');
        checkLoginStatus();
        window.router.navigate('/profile');
    });
    
    window.addEventListener('userLoggedOut', (e) => {
        console.log('User logged out event received');
        checkLoginStatus();
        window.router.navigate('/home');
    });
}

/**
 * Update page title
 */
function updatePageTitle(title) {
    document.title = title;
}

/**
 * Show message to user
 */
function showMessage(message, type = 'info') {
    console.log('Showing message:', message, 'type:', type);
    
    // Create message container if it doesn't exist
    let messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
        messageContainer.style.position = 'fixed';
        messageContainer.style.top = '80px';
        messageContainer.style.right = '20px';
        messageContainer.style.zIndex = '9999';
        messageContainer.style.maxWidth = '400px';
        document.body.appendChild(messageContainer);
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    messageContainer.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

/**
 * Logout function
 */
function logout() {
    console.log('User is logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    currentUser = null;
    isLoggedIn = false;
    
    // Dispatch logout event
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
    showMessage('התנתקת בהצלחה', 'success');
}

/**
 * Show login form (for home page)
 */
function showLoginForm() {
    if (window.router.getCurrentRoute() !== '/home') {
        window.router.navigate('/home');
        setTimeout(() => {
            const loginTab = document.querySelector('[onclick="switchTab(\'login\')"]');
            if (loginTab) loginTab.click();
        }, 100);
    } else {
        const loginTab = document.querySelector('[onclick="switchTab(\'login\')"]');
        if (loginTab) loginTab.click();
    }
}

/**
 * Show register form (for home page)
 */
function showRegisterForm() {
    if (window.router.getCurrentRoute() !== '/home') {
        window.router.navigate('/home');
        setTimeout(() => {
            const registerTab = document.querySelector('[onclick="switchTab(\'register\')"]');
            if (registerTab) registerTab.click();
        }, 100);
    } else {
        const registerTab = document.querySelector('[onclick="switchTab(\'register\')"]');
        if (registerTab) registerTab.click();
    }
}

// Make functions globally available
window.logout = logout;
window.showLoginForm = showLoginForm;
window.showRegisterForm = showRegisterForm;
window.showMessage = showMessage;
window.currentUser = currentUser;
window.isLoggedIn = isLoggedIn;

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

console.log('App.js loaded successfully!');