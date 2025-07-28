// profile.js - קובץ JavaScript לדף הפרופיל

console.log('דף הפרופיל נטען!');

// DOM element references for geolocation
const detectLocationBtn = document.getElementById('detectLocationBtn');
const cityInput = document.getElementById('city');



// פונקציה לטעינת נתוני המשתמש
function loadUserData() {
    console.log('טוען נתוני משתמש...');
    
    // בדיקה אם המשתמש מחובר
    if (!currentUser) {
        console.log('המשתמש לא מחובר - מעביר לדף התחברות');
        window.location.href = '../index.html';
        return;
    }
    
    console.log('נתוני משתמש זמינים:', currentUser);
    
    // עדכון ממשק המשתמש
    updateUserInterface();
    

}

// פונקציה לעדכון ממשק המשתמש
function updateUserInterface() {
    console.log('מעדכן ממשק משתמש...', currentUser);
    
    // בדיקת אלמנטים
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const roleTextElement = document.getElementById('roleText');
    
    console.log('=== בדיקת אלמנטים ===');
    console.log('userNameElement:', userNameElement);
    console.log('userEmailElement:', userEmailElement);
    console.log('roleTextElement:', roleTextElement);
    
    // עדכון פרטי המשתמש
    if (userNameElement) {
        const fullName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
        userNameElement.textContent = fullName || 'שם לא זמין';
        console.log('עדכון שם משתמש:', fullName);
    } else {
        console.error('אלמנט userName לא נמצא!');
    }
    
    if (userEmailElement) {
        userEmailElement.textContent = currentUser.email || 'אימייל לא זמין';
        console.log('עדכון אימייל:', currentUser.email);
    } else {
        console.error('אלמנט userEmail לא נמצא!');
    }
    
    // עדכון תפקיד המשתמש
    if (roleTextElement) {
        if (currentUser.userType === 'babysitter') {
            roleTextElement.textContent = 'ביביסיטר';
            roleTextElement.innerHTML = '<i class="bi bi-person-badge me-1"></i>ביביסיטר';
        } else if (currentUser.userType === 'parent') {
            roleTextElement.textContent = 'הורה';
            roleTextElement.innerHTML = '<i class="bi bi-people me-1"></i>הורה';
        } else {
            roleTextElement.textContent = 'לא מוגדר';
            roleTextElement.innerHTML = '<i class="bi bi-question-circle me-1"></i>לא מוגדר';
        }
        console.log('עדכון תפקיד:', currentUser.userType);
    } else {
        console.error('אלמנט roleText לא נמצא!');
    }
    

    
    // מילוי טופס הפרופיל
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const cityInput = document.getElementById('city');
    
    if (firstNameInput) firstNameInput.value = currentUser.firstName || '';
    if (lastNameInput) lastNameInput.value = currentUser.lastName || '';
    if (emailInput) emailInput.value = currentUser.email || '';
    if (phoneInput) phoneInput.value = currentUser.phone || '';
    if (cityInput) cityInput.value = currentUser.city || '';
    
    // Show babysitter fields if user is a babysitter
    const babysitterFields = document.getElementById('babysitterProfileFields');
    if (currentUser.userType === 'babysitter' && babysitterFields) {
        babysitterFields.style.display = 'block';
        
        // Populate babysitter-specific fields
        const babysitterData = currentUser.babysitter || {};
        
        const experienceSelect = document.getElementById('experience');
        const hourlyRateInput = document.getElementById('hourlyRate');
        const isAvailableSelect = document.getElementById('isAvailable');
        const descriptionTextarea = document.getElementById('description');
        
        if (experienceSelect) experienceSelect.value = babysitterData.experience || 'beginner';
        if (hourlyRateInput) hourlyRateInput.value = babysitterData.hourlyRate || '';
        if (isAvailableSelect) isAvailableSelect.value = babysitterData.isAvailable !== false ? 'true' : 'false';
        if (descriptionTextarea) descriptionTextarea.value = babysitterData.description || '';
        
        console.log('שדות ביביסיטר מולאו:', babysitterData);
    }
    
    console.log('טופס הפרופיל מולא');
    
    // עדכון מידע נוסף לפי סוג משתמש
    updateAdditionalInfo();
}

// פונקציה לעדכון מידע נוסף לפי סוג משתמש
function updateAdditionalInfo() {
    console.log('מעדכן מידע נוסף...', currentUser);
    
    const additionalInfo = document.getElementById('additionalInfo');
    if (!additionalInfo) return;
    
    if (currentUser.userType === 'babysitter') {
        const babysitterData = currentUser.babysitter || {};
        const availabilityStatus = babysitterData.isAvailable !== false ? '✅ זמינה' : '❌ לא זמינה';
        const availabilityClass = babysitterData.isAvailable !== false ? 'text-success' : 'text-danger';
        
        additionalInfo.innerHTML = `
            <section class="mb-3">
                <h6><i class="bi bi-check-circle me-2"></i>זמינות</h6>
                <p class="text-muted ${availabilityClass}">${availabilityStatus}</p>
            </section>
            <section class="mb-3">
                <h6><i class="bi bi-currency-dollar me-2"></i>מחיר לשעה</h6>
                <p class="text-muted">${babysitterData.hourlyRate ? babysitterData.hourlyRate + ' ₪' : 'לא צוין'}</p>
            </section>
            <section class="mb-3">
                <h6><i class="bi bi-award me-2"></i>ניסיון</h6>
                <p class="text-muted">${babysitterData.experience || 'לא צוין'}</p>
            </section>
            <section class="mb-3">
                <h6><i class="bi bi-chat-text me-2"></i>תיאור</h6>
                <p class="text-muted">${babysitterData.description || 'אין תיאור'}</p>
            </section>
        `;
    } else {
        additionalInfo.innerHTML = `
            <section class="mb-3">
                <h6><i class="bi bi-info-circle me-2"></i>סוג משתמש</h6>
                <p class="text-muted">הורה</p>
            </section>
        `;
    }
}





// פונקציה לעדכון פרופיל
function updateProfile(event) {
    event.preventDefault();
    console.log('מעדכן פרופיל...');
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('אין הרשאה לעדכון פרופיל', 'danger');
        return;
    }
    
    // בדיקה אם יש סיסמה חדשה
    const newPassword = data.newPassword;
    if (newPassword && newPassword.length > 0) {
        if (newPassword.length < 6) {
            showMessage('הסיסמה חייבת להכיל לפחות 6 תווים', 'warning');
            return;
        }
        data.password = newPassword;
    }
    
    // הסרת שדה הסיסמה החדשה מהנתונים שנשלחים
    delete data.newPassword;
    
    // Handle babysitter-specific fields
    if (currentUser.userType === 'babysitter') {
        // Convert isAvailable string to boolean
        if (data.isAvailable !== undefined) {
            data.isAvailable = data.isAvailable === 'true';
        }
        // Convert hourlyRate to number
        if (data.hourlyRate !== undefined && data.hourlyRate !== '') {
            data.hourlyRate = parseInt(data.hourlyRate);
        }
    }
    
    // הצגת טעינה
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>שומר...';
    submitBtn.disabled = true;
    
    // שליחה לשרת
    fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('פרופיל עודכן:', data);
        
        // עדכון נתונים מקומיים
        currentUser = { ...currentUser, ...data.user };
        localStorage.setItem('userData', JSON.stringify(currentUser));
        
        // עדכון ממשק
        updateUserInterface();
        
        // ניקוי שדה הסיסמה
        const passwordInput = document.getElementById('newPassword');
        if (passwordInput) passwordInput.value = '';
        
        showMessage('הפרופיל עודכן בהצלחה!', 'success');
    })
    .catch(error => {
        console.error('שגיאה בעדכון פרופיל:', error);
        showMessage('שגיאה בעדכון פרופיל', 'danger');
    })
    .finally(() => {
        // החזרת כפתור למצב רגיל
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// פונקציה להצגת הודעות
function showMessage(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // הסרה אוטומטית אחרי 5 שניות
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}



// פונקציה לעיצוב תאריך
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // פחות מדקה
        return 'עכשיו';
    } else if (diff < 3600000) { // פחות משעה
        const minutes = Math.floor(diff / 60000);
        return `לפני ${minutes} דקות`;
    } else if (diff < 86400000) { // פחות מיום
        const hours = Math.floor(diff / 3600000);
        return `לפני ${hours} שעות`;
    } else {
        return date.toLocaleDateString('he-IL');
    }
}

// Setup role-based navigation menu
function setupRoleBasedMenu(userType) {
    const navigationMenu = document.getElementById('navigationMenu');
    if (!navigationMenu) return;
    
    let menuItems = '';
    
    if (userType === 'parent') {
        // Parents can search for babysitters and see conversations
        menuItems = `
            <li class="nav-item">
                <a class="nav-link" href="search.html">חיפוש בייביסיטר</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="conversations.html">שיחות</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="about.html">אודות</a>
            </li>
        `;
    } else if (userType === 'babysitter') {
        // Babysitters can only see conversations and about
        menuItems = `
            <li class="nav-item">
                <a class="nav-link" href="conversations.html">שיחות</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="about.html">אודות</a>
            </li>
        `;
    }
    
    navigationMenu.innerHTML = menuItems;
}

// Logout Function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

// הגדרת מאזיני אירועים
function setupEventListeners() {
    console.log('מגדיר מאזיני אירועים לדף הפרופיל...');
    
    // טופס עדכון פרופיל
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', updateProfile);
    }
    
    // Geolocation button event listener
    if (detectLocationBtn && cityInput) {
        console.log('מגדיר מאזין לכפתור זיהוי מיקום');
        detectLocationBtn.addEventListener('click', async function() {
            console.log('כפתור זיהוי מיקום נלחץ');
            
            let originalText = detectLocationBtn.innerHTML;
            detectLocationBtn.innerHTML = '<i class="bi bi-hourglass-split"></i>';
            detectLocationBtn.disabled = true;
            
            try {
                const city = await window.geolocationService.autoDetectCity(cityInput);
                console.log('עיר זוהתה:', city);
            } catch (error) {
                console.error('שגיאה בזיהוי מיקום:', error);
            } finally {
                detectLocationBtn.innerHTML = originalText;
                detectLocationBtn.disabled = false;
            }
        });
    } else {
        console.log('כפתור זיהוי מיקום או שדה עיר לא נמצאו');
    }
    
    console.log('מאזיני אירועים הוגדרו');
}

// אתחול הדף
document.addEventListener('DOMContentLoaded', function() {
    console.log('דף הפרופיל נטען - מתחיל אתחול...');
    
    // בדיקת נתונים ב-localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    console.log('=== בדיקת נתונים ===');
    console.log('טוקן קיים:', !!token);
    console.log('נתוני משתמש קיימים:', !!userData);
    
    if (userData) {
        try {
            const parsedData = JSON.parse(userData);
            console.log('נתוני משתמש מפורשים:', parsedData);
            
            // בדיקה אם הנתונים תקינים
            if (parsedData.firstName && parsedData.email) {
                console.log('הנתונים תקינים - מתחיל טעינה');
                currentUser = parsedData;
                loadUserData(); // קריאה לפונקציה המרכזית
                
                // Update navigation for logged in users
                const authButtons = document.getElementById('authButtons');
                if (authButtons) {
                    authButtons.innerHTML = `
                        <li class="nav-item">
                            <span class="navbar-text me-3 text-light">
                                שלום, ${parsedData.firstName || 'משתמש'}!
                            </span>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" onclick="logout()">
                                <i class="bi bi-box-arrow-right"></i> התנתק
                            </a>
                        </li>
                    `;
                }
                
                // Set home link to profile for logged in users
                const homeLink = document.getElementById('homeLink');
                if (homeLink) {
                    homeLink.href = 'profile.html';
                    homeLink.onclick = function(e) {
                        e.preventDefault();
                        window.location.href = 'profile.html';
                    };
                }
                
                // Setup role-based navigation menu
                setupRoleBasedMenu(parsedData.userType);
            } else {
                console.error('נתונים חסרים - מעביר להתחברות');
                window.location.href = '../index.html';
            }
        } catch (error) {
            console.error('שגיאה בפענוח נתונים:', error);
            window.location.href = '../index.html';
        }
    } else {
        console.error('אין נתוני משתמש - מעביר להתחברות');
        window.location.href = '../index.html';
    }
    
    // הגדרת מאזיני אירועים
    setupEventListeners();
    
    console.log('דף הפרופיל הותחל בהצלחה!');
}); 