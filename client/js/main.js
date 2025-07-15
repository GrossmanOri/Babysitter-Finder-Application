// main.js - הקובץ הראשי של JavaScript
// פרויקט סיום קורס ווב ענן - Babysitter Finder

console.log('הקובץ הראשי נטען!');

// משתנים גלובליים
let currentUser = null;
let isLoggedIn = false;

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
    
    // החלפת כפתורי התחברות/הרשמה
    const authButtons = document.querySelectorAll('.auth-buttons');
    authButtons.forEach(button => {
        button.innerHTML = `
            <span class="navbar-text me-3">
                שלום, ${currentUser.firstName}!
            </span>
            <button class="btn btn-outline-light btn-sm" onclick="logout()">
                התנתק
            </button>
        `;
    });
    
    // הוספת קישור לפרופיל
    const navbarNav = document.querySelector('.navbar-nav');
    if (navbarNav && !document.querySelector('.profile-link')) {
        const profileLi = document.createElement('li');
        profileLi.className = 'nav-item';
        profileLi.innerHTML = `
            <a class="nav-link" href="pages/profile.html">
                <i class="bi bi-person-circle"></i> הפרופיל שלי
            </a>
        `;
        navbarNav.appendChild(profileLi);
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
    
    // הפניה לדף הבית
    window.location.href = 'index.html';
    
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
    
    // אנימציה של אלמנטים
    animatePageElements();
    
    console.log('האתחול הושלם!');
});

// הגדרת מאזיני אירועים
function setupEventListeners() {
    console.log('מגדיר מאזיני אירועים...');
    
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