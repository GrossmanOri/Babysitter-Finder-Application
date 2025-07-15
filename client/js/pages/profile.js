// profile.js - קובץ JavaScript לדף הפרופיל

console.log('דף הפרופיל נטען!');

// משתנים גלובליים - שימוש במשתנה הגלובלי מ-main.js
let userMessages = [];
let userStats = {
    totalMessages: 0,
    totalBookings: 0,
    userRating: 0
};

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
    
    // טעינת הודעות וסטטיסטיקות
    loadUserMessages();
    loadUserStats();
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
    
    // עדכון אווטאר
    const avatar = document.getElementById('userAvatar');
    if (avatar) {
        avatar.innerHTML = `<i class="bi bi-${currentUser.userType === 'babysitter' ? 'person-badge' : 'people'}"></i>`;
        console.log('עדכון אווטאר');
    } else {
        console.error('אלמנט userAvatar לא נמצא!');
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
        additionalInfo.innerHTML = `
            <section class="mb-3">
                <h6><i class="bi bi-calendar me-2"></i>גיל</h6>
                <p class="text-muted">${babysitterData.age || 'לא צוין'}</p>
            </section>
            <section class="mb-3">
                <h6><i class="bi bi-award me-2"></i>ניסיון</h6>
                <p class="text-muted">${getExperienceText(babysitterData.experience)}</p>
            </section>
            <section class="mb-3">
                <h6><i class="bi bi-currency-dollar me-2"></i>מחיר לשעה</h6>
                <p class="text-muted">${babysitterData.hourlyRate ? babysitterData.hourlyRate + ' ₪' : 'לא צוין'}</p>
            </section>
            <section class="mb-3">
                <h6><i class="bi bi-chat-text me-2"></i>תיאור</h6>
                <p class="text-muted">${babysitterData.description || 'אין תיאור'}</p>
            </section>
        `;
    } else {
        const parentData = currentUser.parent || {};
        additionalInfo.innerHTML = `
            <section class="mb-3">
                <h6><i class="bi bi-people-fill me-2"></i>מספר ילדים</h6>
                <p class="text-muted">${parentData.childrenCount || 'לא צוין'}</p>
            </section>
            <section class="mb-3">
                <h6><i class="bi bi-calendar-range me-2"></i>גילאי ילדים</h6>
                <p class="text-muted">${parentData.childrenAges ? parentData.childrenAges.join(', ') + ' שנים' : 'לא צוין'}</p>
            </section>
        `;
    }
}

// פונקציה להמרת רמת ניסיון לטקסט
function getExperienceText(experience) {
    const experienceMap = {
        'beginner': '🌱 מתחילה',
        'intermediate': '⭐ בינונית',
        'expert': '🏆 מנוסה'
    };
    return experienceMap[experience] || 'לא צוין';
}

// פונקציה לטעינת הודעות המשתמש
function loadUserMessages() {
    console.log('טוען הודעות משתמש...');
    
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('אין טוקן - לא ניתן לטעון הודעות');
        return;
    }
    
    // שליחה לשרת לקבלת הודעות
    fetch('/api/messages/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('הודעות התקבלו:', data);
        userMessages = data.messages || [];
        displayMessages();
    })
    .catch(error => {
        console.error('שגיאה בטעינת הודעות:', error);
        // הצגת הודעות לדוגמה אם אין חיבור לשרת
        displaySampleMessages();
    });
}

// פונקציה להצגת הודעות
function displayMessages() {
    console.log('מציג הודעות...');
    
    const messagesList = document.getElementById('messagesList');
    
    if (userMessages.length === 0) {
        messagesList.innerHTML = `
            <section class="text-center text-muted py-5">
                <i class="bi bi-chat-dots display-4 mb-3"></i>
                <h5>אין הודעות עדיין</h5>
                <p>כשתתחיל לתקשר עם בייביסיטרים או הורים, ההודעות יופיעו כאן</p>
            </section>
        `;
        return;
    }
    
    const messagesHTML = userMessages.map(message => `
        <section class="message-item">
            <section class="message-header">
                <section class="message-sender">
                    <i class="bi bi-person me-2"></i>
                    ${message.senderName || 'משתמש'}
                </section>
                <section class="message-time">
                    ${formatDate(message.createdAt)}
                </section>
            </section>
            <section class="message-content">
                ${message.content}
            </section>
        </section>
    `).join('');
    
    messagesList.innerHTML = messagesHTML;
}

// פונקציה להצגת הודעות לדוגמה
function displaySampleMessages() {
    console.log('מציג הודעות לדוגמה...');
    
    const sampleMessages = [
        {
            senderName: 'שרה כהן',
            content: 'שלום! האם את זמינה היום בערב?',
            createdAt: new Date(Date.now() - 3600000) // שעה אחורה
        },
        {
            senderName: 'דוד לוי',
            content: 'תודה על השירות המעולה! הילדים מאוד נהנו',
            createdAt: new Date(Date.now() - 86400000) // יום אחורה
        }
    ];
    
    const messagesList = document.getElementById('messagesList');
    const messagesHTML = sampleMessages.map(message => `
        <section class="message-item">
            <section class="message-header">
                <section class="message-sender">
                    <i class="bi bi-person me-2"></i>
                    ${message.senderName}
                </section>
                <section class="message-time">
                    ${formatDate(message.createdAt)}
                </section>
            </section>
            <section class="message-content">
                ${message.content}
            </section>
        </section>
    `).join('');
    
    messagesList.innerHTML = messagesHTML;
}

// פונקציה לטעינת סטטיסטיקות המשתמש
function loadUserStats() {
    console.log('טוען סטטיסטיקות משתמש...');
    
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('אין טוקן - לא ניתן לטעון סטטיסטיקות');
        return;
    }
    
    // שליחה לשרת לקבלת סטטיסטיקות
    fetch('/api/users/stats', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('סטטיסטיקות התקבלו:', data);
        userStats = data.data || data; // תמיכה בשני הפורמטים
        displayStats();
    })
    .catch(error => {
        console.error('שגיאה בטעינת סטטיסטיקות:', error);
        // הצגת סטטיסטיקות לדוגמה
        displaySampleStats();
    });
}

// פונקציה להצגת סטטיסטיקות
function displayStats() {
    console.log('מציג סטטיסטיקות...');
    
    document.getElementById('totalMessages').textContent = userStats.totalMessages || 0;
    document.getElementById('totalBookings').textContent = userStats.totalBookings || 0;
    document.getElementById('userRating').textContent = userStats.userRating || 0;
}

// פונקציה להצגת סטטיסטיקות לדוגמה
function displaySampleStats() {
    console.log('מציג סטטיסטיקות לדוגמה...');
    
    document.getElementById('totalMessages').textContent = '5';
    document.getElementById('totalBookings').textContent = '3';
    document.getElementById('userRating').textContent = '4.8';
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

// פונקציה לשינוי סיסמה
function changePassword() {
    console.log('פותח חלון שינוי סיסמה...');
    
    const newPassword = prompt('הכנס סיסמה חדשה (לפחות 6 תווים):');
    if (!newPassword) return;
    
    if (newPassword.length < 6) {
        showMessage('הסיסמה חייבת להכיל לפחות 6 תווים', 'warning');
        return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('אין הרשאה לשינוי סיסמה', 'danger');
        return;
    }
    
    // שליחה לשרת
    fetch('/api/users/password', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPassword })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('סיסמה שונתה:', data);
        showMessage('הסיסמה שונתה בהצלחה!', 'success');
    })
    .catch(error => {
        console.error('שגיאה בשינוי סיסמה:', error);
        showMessage('שגיאה בשינוי סיסמה', 'danger');
    });
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

// הגדרת מאזיני אירועים
function setupEventListeners() {
    console.log('מגדיר מאזיני אירועים לדף הפרופיל...');
    
    // טופס עדכון פרופיל
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', updateProfile);
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