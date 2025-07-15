// main.js - הקובץ הראשי של JavaScript
// פרויקט סיום קורס ווב ענן - Babysitter Finder

console.log('הקובץ הראשי נטען!');

// משתנים גלובליים
let currentUser = null;
let isLoggedIn = false;

// הגדרת כתובת ה-API
const API_BASE_URL = '/api';

// פונקציה להחלפת בין טפסים
function switchTab(tabName) {
    console.log('מחליף לטאב:', tabName);
    
    // הסרת active מכל הטאבים
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // הסתרת כל הטפסים
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    // הוספת active לטאב הנבחר
    const selectedTab = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // הצגת הטופס הנבחר
    const selectedForm = document.getElementById(`${tabName}Form`);
    if (selectedForm) {
        selectedForm.classList.add('active');
    }
    
    // ניקוי הודעות
    clearMessages();
}

// פונקציה לניקוי הודעות
function clearMessages() {
    const messages = ['loginMessage', 'registerMessage'];
    messages.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '';
        }
    });
}

// בדיקה אם המשתמש מחובר
function checkLoginStatus() {
    console.log('בודק סטטוס התחברות...');
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        try {
            currentUser = JSON.parse(userData);
            isLoggedIn = true;
            console.log('המשתמש מחובר:', currentUser.firstName);
            updateUIForLoggedInUser();
        } catch (error) {
            console.error('שגיאה בפענוח נתוני המשתמש:', error);
            logout();
        }
    } else {
        console.log('המשתמש לא מחובר');
        updateUIForGuestUser();
    }
}

// עדכון ממשק למשתמש מחובר
function updateUIForLoggedInUser() {
    console.log('מעדכן ממשק למשתמש מחובר');
    
    // עדכון כפתורי התחברות/הרשמה
    const authButtons = document.getElementById('authButtons');
    if (authButtons) {
        authButtons.innerHTML = `
            <li class="nav-item">
                <span class="navbar-text me-3 text-light">
                    שלום, ${currentUser.firstName}!
                </span>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="logout()">
                    <i class="bi bi-box-arrow-right"></i> התנתק
                </a>
            </li>
        `;
    }
    
    // הוספת קישור לפרופיל (רק בדף הבית)
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        const navbarNav = document.querySelector('.navbar-nav');
        if (navbarNav && !document.querySelector('.profile-link')) {
            const profileLi = document.createElement('li');
            profileLi.className = 'nav-item profile-link';
            profileLi.innerHTML = `
                <a class="nav-link" href="pages/profile.html">
                    <i class="bi bi-person-circle"></i> הפרופיל שלי
                </a>
            `;
            navbarNav.appendChild(profileLi);
        }
    }
}

// עדכון ממשק למשתמש אורח
function updateUIForGuestUser() {
    console.log('מעדכן ממשק למשתמש אורח');
    
    // הסרת קישור לפרופיל
    const profileLink = document.querySelector('.profile-link');
    if (profileLink) {
        profileLink.remove();
    }
}

// פונקציית התנתקות
function logout() {
    console.log('המשתמש מתנתק...');
    
    // מחיקת נתונים מהאחסון המקומי
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    // איפוס משתנים
    currentUser = null;
    isLoggedIn = false;
    
    // עדכון ממשק
    updateUIForGuestUser();
    
    // הפניה לדף הבית - בדיקה אם אנחנו בתיקיית pages
    const currentPath = window.location.pathname;
    if (currentPath.includes('/pages/')) {
        window.location.href = '../index.html';
    } else {
        window.location.href = 'index.html';
    }
    
    console.log('ההתנתקות הושלמה');
}

// פונקציה לבדיקת תקינות טופס
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

// פונקציה להצגת הודעות
function showMessage(message, type = 'info') {
    console.log('מציג הודעה:', message, 'סוג:', type);
    
    // יצירת אלמנט ההודעה
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // הוספה לדף
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    // הסרה אוטומטית אחרי 5 שניות
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// פונקציה לטעינת נתונים
function loadData(url, options = {}) {
    console.log('טוען נתונים מ:', url);
    
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    // הוספת token אם המשתמש מחובר
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

// פונקציה לשליחת נתונים
function sendData(url, data, method = 'POST') {
    console.log('שולח נתונים ל:', url, 'נתונים:', data);
    
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    
    // הוספת token אם המשתמש מחובר
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

// פונקציה לאנימציה של אלמנטים
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

// פונקציה לבדיקת חיבור לאינטרנט
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

// פונקציה לניהול שגיאות

// פונקציונליות הרשמה
function setupRegistrationForm() {
    console.log('מגדיר טופס הרשמה...');
    
    const userTypeSelect = document.getElementById('userType');
    const babysitterFields = document.getElementById('babysitterFields');
    const parentFields = document.getElementById('parentFields');
    const form = document.getElementById('registerForm');
    const formMessage = document.getElementById('formMessage');

    if (!userTypeSelect || !babysitterFields || !parentFields || !form) {
        console.log('לא נמצאו אלמנטי הטופס');
        return;
    }

    function toggleFields() {
        if (userTypeSelect.value === 'babysitter') {
            babysitterFields.style.display = '';
            parentFields.style.display = 'none';
            babysitterFields.style.opacity = '0';
            setTimeout(() => {
                babysitterFields.style.opacity = '1';
                babysitterFields.style.transition = 'opacity 0.3s ease';
            }, 10);
        } else {
            babysitterFields.style.display = 'none';
            parentFields.style.display = '';
            parentFields.style.opacity = '0';
            setTimeout(() => {
                parentFields.style.opacity = '1';
                parentFields.style.transition = 'opacity 0.3s ease';
            }, 10);
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

// פונקציה לבדיקת תאימות דפדפן
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

// פונקציה לניהול עומס
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

// פונקציה לניהול היסטוריה
function addToHistory(page, title) {
    console.log('מוסיף להיסטוריה:', page, title);
    
    const history = JSON.parse(localStorage.getItem('pageHistory') || '[]');
    history.push({
        page: page,
        title: title,
        timestamp: new Date().toISOString()
    });
    
    // שמירת רק 10 הדפים האחרונים
    if (history.length > 10) {
        history.shift();
    }
    
    localStorage.setItem('pageHistory', JSON.stringify(history));
}

// פונקציה לבדיקת ביצועים
function checkPerformance() {
    console.log('בודק ביצועים...');
    
    const loadTime = performance.now();
    console.log('זמן טעינה:', loadTime, 'מילישניות');
    
    if (loadTime > 3000) {
        console.warn('זמן טעינה איטי:', loadTime);
    }
}

// בדיקה שהדף נטען כמו שצריך
console.log('הדף נטען בהצלחה!');

// פונקציה לבדיקת הטופס
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

// הוספת event listener לטופס
const heroForm = document.getElementById('heroSearchForm');
if (heroForm) {
    heroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        checkForm();
    });
}

// הוספת אנימציה לתכונות
window.addEventListener('DOMContentLoaded', function() {
    console.log('הדף מוכן!');
    // הוספת אפקט hover לתכונות
    const features = document.querySelectorAll('.feature-card');
    features.forEach(function(feature) {
        feature.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        feature.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
    
    // הגדרת אוטוקומפליט לערים
    setupCityAutocomplete();
});

// Handle city autocomplete
function handleCityAutocomplete(event) {
    const query = event.target.value.trim();
    
    if (query.length < 2) {
        hideAutocomplete();
        return;
    }
    
    console.log('מחפש ערים עבור:', query);
    
    // Call external API for city suggestions
    fetchCitiesFromAPI(query)
        .then(cities => {
            console.log('ערים שנמצאו:', cities);
            showCityAutocomplete(cities);
        })
        .catch(error => {
            console.error('Error fetching cities:', error);
            // Fallback to local cities
            const localCities = getLocalCities().filter(city => 
                city.name.includes(query) || city.name.includes(query)
            );
            showCityAutocomplete(localCities);
        });
}

// Fetch cities from external API
function fetchCitiesFromAPI(query) {
    return fetch(`${API_BASE_URL}/cities?q=${encodeURIComponent(query)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data.cities || [];
        });
}

// Get local cities as fallback
function getLocalCities() {
    return [
        { name: 'תל אביב-יפו', region: 'תל אביב' },
        { name: 'ירושלים', region: 'ירושלים' },
        { name: 'חיפה', region: 'חיפה' },
        { name: 'ראשון לציון', region: 'המרכז' },
        { name: 'פתח תקווה', region: 'המרכז' },
        { name: 'אשדוד', region: 'הדרום' },
        { name: 'נתניה', region: 'המרכז' },
        { name: 'באר שבע', region: 'הדרום' },
        { name: 'חולון', region: 'המרכז' },
        { name: 'רמת גן', region: 'המרכז' },
        { name: 'הרצליה', region: 'המרכז' },
        { name: 'כפר סבא', region: 'המרכז' },
        { name: 'רחובות', region: 'המרכז' },
        { name: 'קריית גת', region: 'הדרום' },
        { name: 'טבריה', region: 'הצפון' },
        { name: 'עכו', region: 'הצפון' },
        { name: 'נצרת', region: 'הצפון' },
        { name: 'אום אל-פחם', region: 'הצפון' },
        { name: 'אופקים', region: 'הדרום' },
        { name: 'אילת', region: 'הדרום' }
    ];
}

// Show city autocomplete dropdown
function showCityAutocomplete(cities) {
    hideAutocomplete();
    
    if (cities.length === 0) {
        return;
    }
    
    const cityInput = document.getElementById('city');
    const autocompleteContainer = document.createElement('section');
    autocompleteContainer.className = 'autocomplete-dropdown';
    autocompleteContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 0 0 10px 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
    `;
    
    cities.forEach(city => {
        const cityItem = document.createElement('article');
        cityItem.className = 'autocomplete-item';
        cityItem.style.cssText = `
            padding: 10px 15px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            transition: background-color 0.2s;
        `;
        cityItem.textContent = city.name;
        
        cityItem.addEventListener('click', function() {
            cityInput.value = city.name;
            hideAutocomplete();
        });
        
        cityItem.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        
        cityItem.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'white';
        });
        
        autocompleteContainer.appendChild(cityItem);
    });
    
    cityInput.parentNode.style.position = 'relative';
    cityInput.parentNode.appendChild(autocompleteContainer);
}

// Hide autocomplete dropdown
function hideAutocomplete() {
    const existingDropdown = document.querySelector('.autocomplete-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }
}

// Setup city autocomplete
function setupCityAutocomplete() {
    const cityInput = document.getElementById('city');
    if (cityInput) {
        console.log('מגדיר אוטוקומפליט לערים');
        cityInput.addEventListener('input', handleCityAutocomplete);
        cityInput.addEventListener('blur', function() {
            // Hide dropdown after a short delay to allow clicking
            setTimeout(hideAutocomplete, 200);
        });
    }
}

// אתחול האפליקציה
document.addEventListener('DOMContentLoaded', function() {
    console.log('הדף נטען - מתחיל אתחול...');
    
    // בדיקות ראשוניות
    checkLoginStatus();
    checkInternetConnection();
    checkBrowserCompatibility();
    checkPerformance();
    
    // הוספת מאזיני אירועים
    setupEventListeners();
    
    // הגדרת טופס הרשמה
    setupRegistrationForm();
    
    // אנימציה של אלמנטים
    animatePageElements();
    
    console.log('האתחול הושלם!');
});

// הגדרת מאזיני אירועים
function setupEventListeners() {
    console.log('מגדיר מאזיני אירועים...');
    
    // הגדרת טופס הרשמה
    setupRegistrationForm();
    
    // הגדרת טופס התחברות
    setupLoginForm();
    
    // הגדרת אוטוקומפליט לערים
    setupCityAutocomplete();
    
    // בדיקת סטטוס התחברות
    checkLoginStatus();
    
    // בדיקת חיבור לאינטרנט
    checkInternetConnection();
    
    // בדיקת תאימות דפדפן
    checkBrowserCompatibility();
    
    // אנימציה של אלמנטי הדף
    animatePageElements();
    
    // מאזין לשינוי חיבור לאינטרנט
    window.addEventListener('online', () => {
        console.log('החיבור לאינטרנט חזר');
        showMessage('החיבור לאינטרנט חזר!', 'success');
    });
    
    window.addEventListener('offline', () => {
        console.log('החיבור לאינטרנט נותק');
        showMessage('החיבור לאינטרנט נותק!', 'warning');
    });
    
    // מאזין לשינוי גודל חלון
    window.addEventListener('resize', () => {
        console.log('גודל החלון השתנה:', window.innerWidth, 'x', window.innerHeight);
    });
    
    console.log('מאזיני אירועים הוגדרו');
}

// אנימציה של אלמנטי הדף
function animatePageElements() {
    console.log('מפעיל אנימציות על אלמנטי הדף...');
    
    const elementsToAnimate = document.querySelectorAll('.feature-card, .step-card, .card');
    elementsToAnimate.forEach((element, index) => {
        setTimeout(() => {
            animateElement(element);
        }, index * 100);
    });
}

// פונקציה לבדיקת תקינות נתונים
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

// פונקציה לניקוי נתונים
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

// פונקציה לטיפול בטופס ההתחברות
function setupLoginForm() {
    console.log('מגדיר טופס התחברות...');
    
    const form = document.getElementById('loginForm');
    if (!form) {
        console.log('טופס התחברות לא נמצא');
        return;
    }
    
    // טיפול בשליחת הטופס
    form.addEventListener('submit', handleLogin);
    
    console.log('טופס התחברות מוגדר');
}

// פונקציה לטיפול בהתחברות
function handleLogin(event) {
    event.preventDefault();
    console.log('מטפל בהתחברות...');
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // בדיקת תקינות
    if (!validateForm('loginForm')) {
        return;
    }
    
    // הצגת טעינה
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>מתחבר...';
    submitBtn.disabled = true;
    
    // שליחה לשרת
    sendData('/api/auth/login', data)
        .then(response => {
            console.log('התחברות הצליחה:', response);
            
            // שמירת נתונים
            localStorage.setItem('token', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));
            
            // עדכון משתנים
            currentUser = response.user;
            isLoggedIn = true;
            
            console.log('נתוני משתמש נשמרו:', response.user);
            
            // הצגת הודעת הצלחה
            showFormMessage('loginMessage', 'התחברות הצליחה! מעביר לפרופיל שלך...', 'success');
            
            // הפניה לדף הפרופיל אחרי שנייה
            setTimeout(() => {
                window.location.href = 'pages/profile.html';
            }, 1000);
        })
        .catch(error => {
            console.error('שגיאה בהתחברות:', error);
            showFormMessage('loginMessage', 'שגיאה בהתחברות. בדוק את הפרטים ונסה שוב.', 'danger');
        })
        .finally(() => {
            // החזרת כפתור למצב רגיל
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

// פונקציה להצגת הודעות בטופס
function showFormMessage(elementId, message, type = 'info') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
    }
}

// פונקציה לטיפול בהרשמה (עדכון)
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
    
    // הוספת פרטים ספציפיים לפי סוג משתמש
    if (userType === 'babysitter') {
        data.age = formData.get('age');
        data.experience = formData.get('experience');
        data.hourlyRate = formData.get('hourlyRate');
        data.description = formData.get('description');
    } else {
        data.childrenCount = formData.get('childrenCount');
        data.childrenAges = formData.get('childrenAges') ? formData.get('childrenAges').split(',').map(x => parseInt(x.trim(), 10)) : [];
    }
    
    // בדיקת תקינות
    if (!validateForm('registerForm')) {
        return;
    }
    
    // הצגת טעינה
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>מעבד...';
    submitBtn.disabled = true;
    
    // שליחה לשרת
    sendData('/api/auth/register', data)
        .then(response => {
            console.log('הרשמה הצליחה:', response);
            
            // הצגת הודעת הצלחה
            showFormMessage('registerMessage', 'הרשמה הצליחה! תועבר לטופס ההתחברות...', 'success');
            
            // ניקוי הטופס
            form.reset();
            
            // מעבר לטופס התחברות אחרי 2 שניות
            setTimeout(() => {
                switchTab('login');
            }, 2000);
        })
        .catch(error => {
            console.error('שגיאה בהרשמה:', error);
            showFormMessage('registerMessage', 'שגיאה בהרשמה. בדוק את הפרטים ונסה שוב.', 'danger');
        })
        .finally(() => {
            // החזרת כפתור למצב רגיל
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
} 