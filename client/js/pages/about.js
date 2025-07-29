// About page JavaScript file
// Handles navigation and user authentication for the about page

console.log('דף אודות נטען!');

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
                <a class="nav-link" href="conversations.html">שיחות</a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" href="about.html">אודות</a>
            </li>
        `;
    } else if (userType === 'babysitter') {
        // Navigation items for babysitters
        menuItems = `
            <li class="nav-item">
                <a class="nav-link" href="conversations.html">שיחות</a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" href="about.html">אודות</a>
            </li>
        `;
    }
    
    navigationMenu.innerHTML = menuItems;
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
            console.error('שגיאה בפענוח נתוני משתמש:', error);
            // Fallback to guest user setup
            setupGuestNavigation();
        }
    } else {
        // Set up navigation for guest user
        setupGuestNavigation();
    }
}

/**
 * Sets up navigation for non-authenticated users
 */
function setupGuestNavigation() {
    console.log('מגדיר ניווט למשתמש אורח');
    
    // Set up auth buttons for guest user
    const authButtons = document.getElementById('authButtons');
    if (authButtons) {
        authButtons.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="../index.html#login">התחברות</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="../index.html#register">הרשמה</a>
            </li>
        `;
    }
    
    // Set up home link for guest user
    const homeLink = document.getElementById('homeLink');
    if (homeLink) {
        homeLink.href = '../index.html';
    }
    
    // Set up minimal navigation menu for guest user
    const navigationMenu = document.getElementById('navigationMenu');
    if (navigationMenu) {
        navigationMenu.innerHTML = `
            <li class="nav-item">
                <a class="nav-link active" href="about.html">אודות</a>
            </li>
        `;
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

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('דף אודות נטען - מתחיל אתחול...');
    setupNavigation();
    console.log('דף אודות הותחל בהצלחה!');
}); 