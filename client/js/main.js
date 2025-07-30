console.log('הקובץ הראשי נטען!');
let currentUser = null;
let isLoggedIn = false;
const API_BASE_URL = '/api';
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
    console.log('מחליף לטאב:', tabName);
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
    console.log('בודק סטטוס התחברות...');
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData') || localStorage.getItem('user');
    if (token && userData) {
        try {
            currentUser = JSON.parse(userData);
            isLoggedIn = true;
            console.log('המשתמש מחובר:', currentUser.firstName || currentUser.name);
            updateUIForLoggedInUser();
            changeNavigationForLoggedInUser();
        } catch (error) {
            console.error('שגיאה בפענוח נתוני המשתמש:', error);
            logout();
        }
    } else {
        console.log('המשתמש לא מחובר');
        updateUIForGuestUser();
        changeNavigationForGuestUser();
    }
}
function changeNavigationForLoggedInUser() {
    console.log('משנה ניווט למשתמש מחובר...');
    const logoLinks = document.querySelectorAll('.navbar-brand');
    logoLinks.forEach(logoLink => {
        logoLink.href = '/pages/profile.html';
        logoLink.onclick = function(e) {
            e.preventDefault();
            window.location.href = '/pages/profile.html';
        };
    });
    
    const authenticatedNav = document.getElementById('authenticatedNav');
    if (authenticatedNav) {
        authenticatedNav.style.display = 'flex';
    }
    
    const authNav = document.getElementById('authNav');
    if (authNav) {
        authNav.style.display = 'none';
    }
    
    console.log('הניווט שונה למשתמש מחובר');
}
function changeNavigationForGuestUser() {
    console.log('משנה ניווט למשתמש אורח...');
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
    
    console.log('הניווט שונה למשתמש אורח');
}
function updateUIForLoggedInUser() {
    console.log('מעדכן ממשק למשתמש מחובר');
    const authButtons = document.getElementById('authButtons');
    if (authButtons) {
        authButtons.innerHTML = `
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
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        const navbarNav = document.querySelector('.navbar-nav');
        if (navbarNav && !document.querySelector('.profile-link')) {
            const profileLi = document.createElement('li');
            profileLi.className = 'nav-item profile-link d-flex align-items-center';
            profileLi.innerHTML = `
                <a class="nav-link" href="pages/profile.html">
                    <i class="bi bi-person-circle"></i> הפרופיל שלי
                </a>
            `;
            navbarNav.appendChild(profileLi);
        }
    }
}
function updateUIForGuestUser() {
    console.log('מעדכן ממשק למשתמש אורח');
    const profileLink = document.querySelector('.profile-link');
    if (profileLink) {
        profileLink.remove();
    }
    
    // Add authentication buttons for guest users
    const authButtons = document.getElementById('authButtons');
    if (authButtons) {
        authButtons.innerHTML = `
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
    console.log('המשתמש מתנתק...');
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
    console.log('ההתנתקות הושלמה');
}
function validateForm(formId) {
    console.log('בודק תקינות טופס:', formId);
    const form = document.getElementById(formId);
    if (!form) {
        console.error('הטופס לא נמצא:', formId);
        return false;
    }
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            console.log('שדה ריק:', input.name);
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    console.log('תקינות הטופס:', isValid);
    return isValid;
}
function showMessage(message, type = 'info') {
    console.log('מציג הודעה:', message, 'סוג:', type);
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
    console.log('טוען נתונים מ:', url);
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
            console.log('תגובה מהשרת:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('נתונים שהתקבלו:', data);
            return data;
        })
        .catch(error => {
            console.error('שגיאה בטעינת נתונים:', error);
            throw error;
        });
}
function sendData(url, data, method = 'POST') {
    console.log('שולח נתונים ל:', url, 'נתונים:', data);
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
            console.log('תגובה מהשרת:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('תגובה מהשרת:', data);
            return data;
        })
        .catch(error => {
            console.error('שגיאה בשליחת נתונים:', error);
            throw error;
        });
}
function animateElement(element, animation = 'fadeIn') {
    console.log('מפעיל אנימציה על אלמנט:', element);
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    setTimeout(() => {
        element.style.transition = 'all 0.5s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 100);
}
function checkInternetConnection() {
    console.log('בודק חיבור לאינטרנט...');
    if (!navigator.onLine) {
        console.log('אין חיבור לאינטרנט');
        showMessage('אין חיבור לאינטרנט. בדוק את החיבור שלך.', 'warning');
        return false;
    }
    console.log('יש חיבור לאינטרנט');
    return true;
}
function handleRegistration(event) {
    event.preventDefault();
    console.log('מטפל בהרשמה...');
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
    sendData('/api/auth/register', data)
        .then(response => {
            console.log('הרשמה הצליחה:', response);
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
            console.error('שגיאה בהרשמה:', error);
            showFormMessage('registerMessage', 'שגיאה בהרשמה. בדוק את הפרטים ונסה שוב.', 'danger');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}
function setupRegistrationForm() {
    console.log('מגדיר טופס הרשמה...');
    const userTypeSelect = document.getElementById('userType');
    const babysitterFields = document.getElementById('babysitterFields');
    const form = document.getElementById('registerForm');
    if (!userTypeSelect || !babysitterFields || !form) {
        console.log('לא נמצאו אלמנטי הטופס');
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
    console.error('שגיאה:', context, error);
    let message = 'אירעה שגיאה. אנא נסה שוב.';
    if (error.message.includes('401')) {
        message = 'הסשן פג תוקף. אנא התחבר מחדש.';
        logout();
    } else if (error.message.includes('404')) {
        message = 'המשאב המבוקש לא נמצא.';
    } else if (error.message.includes('500')) {
        message = 'שגיאה בשרת. אנא נסה שוב מאוחר יותר.';
    }
    showMessage(message, 'danger');
}
function checkBrowserCompatibility() {
    console.log('בודק תאימות דפדפן...');
    const userAgent = navigator.userAgent;
    const isChrome = userAgent.includes('Chrome');
    const isFirefox = userAgent.includes('Firefox');
    const isSafari = userAgent.includes('Safari');
    const isEdge = userAgent.includes('Edge');
    console.log('דפדפן:', { isChrome, isFirefox, isSafari, isEdge });
    if (!isChrome && !isFirefox && !isSafari && !isEdge) {
        showMessage('מומלץ להשתמש בדפדפן מודרני לתמיכה מלאה.', 'info');
    }
}
function showLoading(elementId = 'loading') {
    const loadingElement = document.getElementById(elementId);
    if (loadingElement) {
        loadingElement.style.display = 'block';
        console.log('מציג אינדיקטור טעינה');
    }
}
function hideLoading(elementId = 'loading') {
    const loadingElement = document.getElementById(elementId);
    if (loadingElement) {
        loadingElement.style.display = 'none';
        console.log('מסתיר אינדיקטור טעינה');
    }
}
function addToHistory(page, title) {
    console.log('מוסיף להיסטוריה:', page, title);
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
    console.log('בודק ביצועים...');
    const loadTime = performance.now();
    console.log('זמן טעינה:', loadTime, 'מילישניות');
    if (loadTime > 3000) {
        console.warn('זמן טעינה איטי:', loadTime);
    }
}
console.log('הדף נטען בהצלחה!');
function checkForm() {
    const city = document.getElementById('city').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    console.log('עיר:', city);
    console.log('תאריך:', date);
    console.log('שעה:', time);
    if (city && date && time) {
        alert('הטופס מלא! מעביר לחיפוש...');
        window.location.href = 'pages/search.html';
    } else {
        alert('אנא מלאו את כל השדות');
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
    console.log('הדף מוכן!');
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
    console.log('הדף נטען - מתחיל אתחול...');
    checkInternetConnection();
    checkBrowserCompatibility();
    checkPerformance();
    setupEventListeners();
    setupRegistrationForm();
    animatePageElements();
    console.log('האתחול הושלם!');
});
function setupEventListeners() {
    console.log('מגדיר מאזיני אירועים...');
    setupRegistrationForm();
    setupLoginForm();
    checkInternetConnection();
    checkBrowserCompatibility();
    animatePageElements();
    window.addEventListener('online', () => {
        console.log('החיבור לאינטרנט חזר');
        showMessage('החיבור לאינטרנט חזר!', 'success');
    });
    window.addEventListener('offline', () => {
        console.log('החיבור לאינטרנט נותק');
        showMessage('החיבור לאינטרנט נותק!', 'warning');
    });
    window.addEventListener('resize', () => {
        console.log('גודל החלון השתנה:', window.innerWidth, 'x', window.innerHeight);
    });
    console.log('מאזיני אירועים הוגדרו');
}
function animatePageElements() {
    console.log('מפעיל אנימציות על אלמנטי הדף...');
    const elementsToAnimate = document.querySelectorAll('.feature-card, .step-card, .card');
    elementsToAnimate.forEach((element, index) => {
        setTimeout(() => {
            animateElement(element);
        }, index * 100);
    });
}
function validateData(data, schema) {
    console.log('בודק תקינות נתונים:', data);
    for (const field in schema) {
        const value = data[field];
        const rules = schema[field];
        if (rules.required && !value) {
            console.error('שדה חובה חסר:', field);
            return false;
        }
        if (rules.minLength && value && value.length < rules.minLength) {
            console.error('שדה קצר מדי:', field);
            return false;
        }
        if (rules.maxLength && value && value.length > rules.maxLength) {
            console.error('שדה ארוך מדי:', field);
            return false;
        }
    }
    console.log('הנתונים תקינים');
    return true;
}
function sanitizeData(data) {
    console.log('מנקה נתונים...');
    const cleaned = {};
    for (const key in data) {
        if (typeof data[key] === 'string') {
            cleaned[key] = data[key].trim().replace(/[<>]/g, '');
        } else {
            cleaned[key] = data[key];
        }
    }
    console.log('הנתונים נוקו');
    return cleaned;
}
console.log('הקובץ הראשי הוכן בהצלחה!');

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
    console.log('מגדיר טופס התחברות...');
    const form = document.getElementById('loginForm');
    if (!form) {
        console.log('טופס התחברות לא נמצא');
        return;
    }
    form.addEventListener('submit', handleLogin);
    console.log('טופס התחברות מוגדר');
}
function handleLogin(event) {
    event.preventDefault();
    console.log('מטפל בהתחברות...');
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
    sendData('/api/auth/login', data)
        .then(response => {
            console.log('התחברות הצליחה:', response);
            localStorage.setItem('token', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));
            currentUser = response.user;
            isLoggedIn = true;
            console.log('נתוני משתמש נשמרו:', response.user);
            showFormMessage('loginMessage', 'התחברות הצליחה! מעביר לפרופיל שלך...', 'success');
            setTimeout(() => {
                window.location.href = 'pages/profile.html';
            }, 1000);
        })
        .catch(error => {
            console.error('שגיאה בהתחברות:', error);
            showFormMessage('loginMessage', 'שגיאה בהתחברות. בדוק את הפרטים ונסה שוב.', 'danger');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
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
