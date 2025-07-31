console.log('Main file loaded!');
let currentUser = null;
let isLoggedIn = false;
const API_BASE_URL = API_CONFIG.getBaseUrl();
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        checkLoginStatus();
    });
} else {
    checkLoginStatus();
}
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(checkLoginStatus, 50);
});
window.addEventListener('load', function() {
    setTimeout(checkLoginStatus, 100);
});
function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    const selectedTab = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    const selectedForm = document.getElementById(`${tabName}Form`);
    if (selectedForm) {
        selectedForm.classList.add('active');
    }
    clearMessages();
}
function clearMessages() {
    const messages = ['loginMessage', 'registerMessage'];
    messages.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '';
        }
    });
}
function checkLoginStatus() {
    console.log('Checking login status...');
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData') || localStorage.getItem('user');
    if (token && userData) {
        try {
            currentUser = JSON.parse(userData);
            isLoggedIn = true;
            console.log('User is logged in:', currentUser.firstName || currentUser.name);
            updateUIForLoggedInUser();
            changeNavigationForLoggedInUser();
        } catch (error) {
            console.error('Error parsing user data:', error);
            logout();
        }
    } else {
        console.log('User is not logged in');
        updateUIForGuestUser();
        changeNavigationForGuestUser();
    }
}
function changeNavigationForLoggedInUser() {
    console.log('Changing navigation for logged in user...');
    const logoLinks = document.querySelectorAll('.navbar-brand');
    logoLinks.forEach(logoLink => {
        logoLink.href = 'pages/profile.html';
        logoLink.onclick = function(e) {
            e.preventDefault();
            window.location.href = 'pages/profile.html';
        };
    });
    
    // Update navbar brand link for logged in users
    const navbarBrand = document.querySelector('.navbar-brand');
    if (navbarBrand) {
        navbarBrand.href = 'pages/profile.html';
        navbarBrand.onclick = function(e) {
            e.preventDefault();
            window.location.href = 'pages/profile.html';
        };
    }
    
    // Add profile link to navigation
    const navAuthButtons = document.getElementById('authButtons');
    if (navAuthButtons && !document.querySelector('.profile-link')) {
        const profileLi = document.createElement('li');
        profileLi.className = 'nav-item profile-link d-flex align-items-center';
        profileLi.innerHTML = `
            <a class="nav-link" href="pages/profile.html">
                <i class="bi bi-person-circle"></i> הפרופיל שלי
            </a>
        `;
        navAuthButtons.appendChild(profileLi);
    }
    
    const authenticatedNav = document.getElementById('authenticatedNav');
    if (authenticatedNav) {
        authenticatedNav.style.display = 'flex';
    }
    
    const authNav = document.getElementById('authNav');
    if (authNav) {
        authNav.style.display = 'none';
    }
    
    console.log('Navigation changed for logged in user');
}
function changeNavigationForGuestUser() {
    console.log('Changing navigation for guest user...');
    const logoLinks = document.querySelectorAll('.navbar-brand');
    logoLinks.forEach(logoLink => {
        logoLink.href = '/index.html';
        logoLink.onclick = null;
    });
    
    const authenticatedNav = document.getElementById('authenticatedNav');
    if (authenticatedNav) {
        authenticatedNav.style.display = 'none';
    }
    
    const authNav = document.getElementById('authNav');
    if (authNav) {
        authNav.style.display = 'flex';
    }
    
    console.log('Navigation changed for guest user');
}
function updateUIForLoggedInUser() {
    console.log('Updating UI for logged in user');
    const uiAuthButtons = document.getElementById('authButtons');
    if (uiAuthButtons) {
        uiAuthButtons.innerHTML = `
            <li class="nav-item d-flex align-items-center">
                <span class="navbar-text me-3 text-light">
                    שלום, ${currentUser.firstName || currentUser.name}!
                </span>
            </li>
            <li class="nav-item d-flex align-items-center">
                <a class="nav-link" href="#" onclick="logout()">
                    <i class="bi bi-box-arrow-right"></i> התנתק
                </a>
            </li>
        `;
    }
    // Add profile link to navigation for logged in users
    const loggedInAuthButtons = document.getElementById('authButtons');
    if (loggedInAuthButtons && !document.querySelector('.profile-link')) {
        const profileLi = document.createElement('li');
        profileLi.className = 'nav-item profile-link d-flex align-items-center';
        profileLi.innerHTML = `
            <a class="nav-link" href="#" onclick="goToProfile()">
                <i class="bi bi-person-circle"></i> הפרופיל שלי
            </a>
        `;
        loggedInAuthButtons.appendChild(profileLi);
    }
    
    // Update home link for logged in users
    const homeLink = document.getElementById('homeLink');
    if (homeLink) {
        // Check if we're already in a pages directory
        const currentPath = window.location.pathname;
        const isInPagesDirectory = currentPath.includes('/pages/');
        
        console.log('Logo navigation - Current path:', currentPath);
        console.log('Logo navigation - Is in pages directory:', isInPagesDirectory);
        
        if (isInPagesDirectory) {
            // If we're in pages directory, go to profile.html (same directory)
            console.log('Logo navigation - Setting href to profile.html');
            homeLink.href = 'profile.html';
            homeLink.onclick = function(e) {
                e.preventDefault();
                console.log('Logo clicked - navigating to profile.html');
                window.location.href = 'profile.html';
            };
        } else {
            // If we're in root directory, go to pages/profile.html
            console.log('Logo navigation - Setting href to pages/profile.html');
            homeLink.href = 'pages/profile.html';
            homeLink.onclick = function(e) {
                e.preventDefault();
                console.log('Logo clicked - navigating to pages/profile.html');
                window.location.href = 'pages/profile.html';
            };
        }
        
        // Force override any other onclick handlers
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Logo clicked (forced override) - Current path:', window.location.pathname);
            
            if (window.location.pathname.includes('/pages/')) {
                console.log('Forced navigation to profile.html');
                window.location.href = 'profile.html';
            } else {
                console.log('Forced navigation to pages/profile.html');
                window.location.href = 'pages/profile.html';
            }
        }, true);
    }
}
function updateUIForGuestUser() {
    console.log('Updating UI for guest user');
    const profileLink = document.querySelector('.profile-link');
    if (profileLink) {
        profileLink.remove();
    }
    
    // Add authentication buttons for guest users
    const guestAuthButtons = document.getElementById('authButtons');
    if (guestAuthButtons) {
        guestAuthButtons.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="/index.html#login">התחברות</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/index.html#register">הרשמה</a>
            </li>
        `;
    }
}
function logout() {
    console.log('User is logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    currentUser = null;
    isLoggedIn = false;
    updateUIForGuestUser();
    const currentPath = window.location.pathname;
    if (currentPath.includes('/pages/')) {
        window.location.href = '../index.html';
    } else {
        window.location.href = 'index.html';
    }
    console.log('Logout completed');
}
function validateForm(formId) {
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
}
function showMessage(message, type = 'info') {
    console.log('Showing message:', message, 'type:', type);
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}
function loadData(url, options = {}) {
    console.log('Loading data from:', url);
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const token = localStorage.getItem('token');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    const finalOptions = { ...defaultOptions, ...options };
    return fetch(url, finalOptions)
        .then(response => {
            console.log('Server response:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            return data;
        })
        .catch(error => {
            console.error('Error loading data:', error);
            throw error;
        });
}
function sendData(url, data, method = 'POST') {
    console.log('Sending data to:', url, 'data:', data);
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const token = localStorage.getItem('token');
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(url, options)
        .then(response => {
            console.log('Server response:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Server response:', data);
            return data;
        })
        .catch(error => {
            console.error('Error sending data:', error);
            throw error;
        });
}
function animateElement(element, animation = 'fadeIn') {
    console.log('Animating element:', element);
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    setTimeout(() => {
        element.style.transition = 'all 0.5s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 100);
}
function checkInternetConnection() {
    console.log('Checking internet connection...');
    if (!navigator.onLine) {
        console.log('No internet connection');
        showMessage('No internet connection. Check your connection.', 'warning');
        return false;
    }
    console.log('Internet connection available');
    return true;
}
function handleRegistration(event) {
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
    if (userType === 'babysitter') {
        data.hourlyRate = formData.get('hourlyRate');
        data.experience = formData.get('experience');
        data.description = formData.get('description');
    }
    if (!validateForm('registerForm')) {
        return;
    }
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>מעבד...';
    submitBtn.disabled = true;
    const registerUrl = API_CONFIG.getUrl('/auth/register');
    console.log('Making register request to:', registerUrl);
    sendData(registerUrl, data)
        .then(response => {
            console.log('Registration successful:', response);
            localStorage.setItem('token', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));
            currentUser = response.user;
            isLoggedIn = true;
            showFormMessage('registerMessage', 'הרשמה הצליחה! מתחבר אוטומטית...', 'success');
            form.reset();
            updateUIForLoggedInUser();
            setTimeout(() => {
                window.location.href = 'pages/profile.html';
            }, 1000);
        })
        .catch(error => {
            console.error('Registration error:', error);
            showFormMessage('registerMessage', 'Registration error. Check the details and try again.', 'danger');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}
function setupRegistrationForm() {
    console.log('Setting up registration form...');
    const userTypeSelect = document.getElementById('userType');
    const babysitterFields = document.getElementById('babysitterFields');
    const form = document.getElementById('registerForm');
    if (!userTypeSelect || !babysitterFields || !form) {
        console.log('Form elements not found');
        return;
    }
    function toggleFields() {
        if (userTypeSelect.value === 'babysitter') {
            babysitterFields.style.display = '';
            babysitterFields.style.opacity = '0';
            setTimeout(() => {
                babysitterFields.style.opacity = '1';
                babysitterFields.style.transition = 'opacity 0.3s ease';
            }, 10);
        } else {
            babysitterFields.style.display = 'none';
        }
    }
    userTypeSelect.addEventListener('change', toggleFields);
    toggleFields();
    form.addEventListener('submit', handleRegistration);
}
function handleError(error, context = '') {
    console.error('Error:', context, error);
    let message = 'An error occurred. Please try again.';
    if (error.message.includes('401')) {
        message = 'Session expired. Please log in again.';
        logout();
    } else if (error.message.includes('404')) {
        message = 'The requested resource was not found.';
    } else if (error.message.includes('500')) {
        message = 'Server error. Please try again later.';
    }
    showMessage(message, 'danger');
}
function checkBrowserCompatibility() {
    console.log('Checking browser compatibility...');
    const userAgent = navigator.userAgent;
    const isChrome = userAgent.includes('Chrome');
    const isFirefox = userAgent.includes('Firefox');
    const isSafari = userAgent.includes('Safari');
    const isEdge = userAgent.includes('Edge');
    console.log('Browser:', { isChrome, isFirefox, isSafari, isEdge });
    if (!isChrome && !isFirefox && !isSafari && !isEdge) {
        showMessage('It is recommended to use a modern browser for full support.', 'info');
    }
}
function showLoading(elementId = 'loading') {
    const loadingElement = document.getElementById(elementId);
    if (loadingElement) {
        loadingElement.style.display = 'block';
        console.log('Showing loading indicator');
    }
}
function hideLoading(elementId = 'loading') {
    const loadingElement = document.getElementById(elementId);
    if (loadingElement) {
        loadingElement.style.display = 'none';
        console.log('Hiding loading indicator');
    }
}
function addToHistory(page, title) {
    console.log('Adding to history:', page, title);
    const history = JSON.parse(localStorage.getItem('pageHistory') || '[]');
    history.push({
        page: page,
        title: title,
        timestamp: new Date().toISOString()
    });
    if (history.length > 10) {
        history.shift();
    }
    localStorage.setItem('pageHistory', JSON.stringify(history));
}
function checkPerformance() {
    console.log('Checking performance...');
    const loadTime = performance.now();
    console.log('Load time:', loadTime, 'milliseconds');
    if (loadTime > 3000) {
        console.warn('Slow load time:', loadTime);
    }
}
console.log('הדף נטען בהצלחה!');
function checkForm() {
    const city = document.getElementById('city').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    console.log('City:', city);
    console.log('Date:', date);
    console.log('Time:', time);
    if (city && date && time) {
        alert('Form is complete! Redirecting to search...');
        window.location.href = 'pages/search.html';
    } else {
        alert('Please fill in all fields');
    }
}
const heroForm = document.getElementById('heroSearchForm');
if (heroForm) {
    heroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        checkForm();
    });
}
window.addEventListener('DOMContentLoaded', function() {
    console.log('Page is ready!');
    const features = document.querySelectorAll('.feature-card');
    features.forEach(function(feature) {
        feature.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        feature.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - starting initialization...');
    checkInternetConnection();
    checkBrowserCompatibility();
    checkPerformance();
    setupEventListeners();
    setupRegistrationForm();
    animatePageElements();
    console.log('Initialization completed!');
});
function setupEventListeners() {
    console.log('Setting up event listeners...');
    setupRegistrationForm();
    setupLoginForm();
    checkInternetConnection();
    checkBrowserCompatibility();
    animatePageElements();
    window.addEventListener('online', () => {
        console.log('Internet connection restored');
        showMessage('Internet connection restored!', 'success');
    });
    window.addEventListener('offline', () => {
        console.log('Internet connection lost');
        showMessage('Internet connection lost!', 'warning');
    });
    window.addEventListener('resize', () => {
        console.log('Window size changed:', window.innerWidth, 'x', window.innerHeight);
    });
    console.log('Event listeners defined');
}
function animatePageElements() {
    console.log('Animating page elements...');
    const elementsToAnimate = document.querySelectorAll('.feature-card, .step-card, .card');
    elementsToAnimate.forEach((element, index) => {
        setTimeout(() => {
            animateElement(element);
        }, index * 100);
    });
}
function validateData(data, schema) {
    console.log('Validating data:', data);
    for (const field in schema) {
        const value = data[field];
        const rules = schema[field];
        if (rules.required && !value) {
            console.error('Required field missing:', field);
            return false;
        }
        if (rules.minLength && value && value.length < rules.minLength) {
            console.error('Field too short:', field);
            return false;
        }
        if (rules.maxLength && value && value.length > rules.maxLength) {
            console.error('Field too long:', field);
            return false;
        }
    }
    console.log('Data is valid');
    return true;
}
function sanitizeData(data) {
    console.log('Sanitizing data...');
    const cleaned = {};
    for (const key in data) {
        if (typeof data[key] === 'string') {
            cleaned[key] = data[key].trim().replace(/[<>]/g, '');
        } else {
            cleaned[key] = data[key];
        }
    }
    console.log('Data sanitized');
    return cleaned;
}
console.log('Main file prepared successfully!');

// Fix navbar-toggler functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        console.log('Navbar toggler found, setting up event listener');
        
        // Ensure Bootstrap collapse is properly initialized
        if (typeof bootstrap !== 'undefined') {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
            
            navbarToggler.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Navbar toggler clicked');
                bsCollapse.toggle();
            });
        } else {
            console.warn('Bootstrap not loaded, using fallback navbar toggle');
            
            // Fallback for when Bootstrap is not available
            navbarToggler.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Using fallback navbar toggle');
                navbarCollapse.classList.toggle('show');
            });
        }
    } else {
        console.log('Navbar toggler or collapse not found');
    }
});
function setupLoginForm() {
    console.log('Setting up login form...');
    const form = document.getElementById('loginForm');
    if (!form) {
        console.log('Login form not found');
        return;
    }
    form.addEventListener('submit', handleLogin);
    console.log('Login form configured');
}
function handleLogin(event) {
    event.preventDefault();
    console.log('=== LOGIN FORM SUBMITTED ===');
    console.log('Handling login...');
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    if (!validateForm('loginForm')) {
        return;
    }
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>מתחבר...';
    submitBtn.disabled = true;
    const loginUrl = API_CONFIG.getUrl('/auth/login');
    console.log('=== MAKING LOGIN REQUEST ===');
    console.log('Making login request to:', loginUrl);
    console.log('Request data:', data);
    sendData(loginUrl, data)
        .then(response => {
            console.log('Login successful:', response);
            localStorage.setItem('token', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));
            currentUser = response.user;
            isLoggedIn = true;
            console.log('User data saved:', response.user);
            showFormMessage('loginMessage', 'התחברות הצליחה! מעביר לפרופיל שלך...', 'success');
            
            // Update UI immediately
            updateUIForLoggedInUser();
            changeNavigationForLoggedInUser();
            
            // Redirect immediately
            console.log('Redirecting to profile page...');
            window.location.href = 'pages/profile.html';
        })
        .catch(error => {
            console.error('Login error:', error);
            showFormMessage('loginMessage', 'Login error. Check the details and try again.', 'danger');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}
function goToProfile() {
    console.log('Navigating to profile page...');
    window.location.href = 'pages/profile.html';
}
function showFormMessage(elementId, message, type = 'info') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
    }
}
