// profile.js - קובץ JavaScript לדף הפרופיל

console.log('Profile page loaded!');

// DOM element references for geolocation
const detectLocationBtn = document.getElementById('detectLocationBtn');
const cityInput = document.getElementById('city');



// פונקציה לטעינת נתוני המשתמש
function loadUserData() {
    console.log('Loading user data...');
    
    // בדיקה אם המשתמש מחובר
    if (!currentUser) {
        console.log('User not logged in - redirecting to login page');
        CLIENT_NAV.goHome();
        return;
    }
    
    console.log('User data available:', currentUser);
    
    // בדיקה שהמשתמש עדיין קיים במסד הנתונים
    verifyUserExists();
    
    // עדכון ממשק המשתמש
    updateUserInterface();
}

// פונקציה לבדיקה שהמשתמש עדיין קיים במסד הנתונים
function verifyUserExists() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No token - redirecting to login');
        CLIENT_NAV.goHome();
        return;
    }
    
    fetch(API_CONFIG.getUrl('/users/profile'), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401 || response.status === 404) {
                console.log('User does not exist or not authorized - redirecting to login');
                localStorage.clear();
                sessionStorage.clear();
                CLIENT_NAV.goHome();
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('User verification successful:', data);
        // המשתמש קיים - אפשר להמשיך
    })
    .catch(error => {
        console.error('Error verifying user:', error);
        // במקרה של שגיאה, נמחק את הנתונים ונעביר להתחברות
        localStorage.clear();
        sessionStorage.clear();
        CLIENT_NAV.goHome();
    });
}

// פונקציה לעדכון ממשק המשתמש
function updateUserInterface() {
    console.log('Updating user interface...', currentUser);
    
    // בדיקת אלמנטים
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const roleTextElement = document.getElementById('roleText');
    
    console.log('=== Element Check ===');
    console.log('userNameElement:', userNameElement);
    console.log('userEmailElement:', userEmailElement);
    console.log('roleTextElement:', roleTextElement);
    
    // עדכון פרטי המשתמש
    if (userNameElement) {
        const fullName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
        userNameElement.textContent = fullName || 'Name not available';
        console.log('Updating username:', fullName);
    } else {
        console.error('userName element not found!');
    }
    
    if (userEmailElement) {
        userEmailElement.textContent = currentUser.email || 'Email not available';
        console.log('Updating email:', currentUser.email);
    } else {
        console.error('userEmail element not found!');
    }
    
    // עדכון תפקיד המשתמש
    if (roleTextElement) {
        if (currentUser.userType === 'babysitter') {
            roleTextElement.textContent = '👶 ביביסיטר';
        } else if (currentUser.userType === 'parent') {
            roleTextElement.textContent = '👥 הורה';
        } else {
            roleTextElement.textContent = '❓ לא מוגדר';
        }
        console.log('Updating role:', currentUser.userType);
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
        
        console.log('Babysitter fields populated:', babysitterData);
    }
    
    console.log('Profile form populated');
    
    // עדכון מידע נוסף לפי סוג משתמש
    updateAdditionalInfo();
}

// פונקציה לעדכון מידע נוסף לפי סוג משתמש
function updateAdditionalInfo() {
    console.log('Updating additional info...', currentUser);
    
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
    console.log('Updating profile...');
    
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
    fetch(API_CONFIG.getUrl('/users/profile'), {
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
        console.log('Profile updated:', data);
        
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

// פונקציה להצגת אישור מחיקה
function showDeleteConfirmation() {
    if (confirm('האם אתה בטוח שברצונך למחוק את החשבון שלך? פעולה זו אינה הפיכה ותמחק את כל הנתונים שלך מהמערכת.')) {
        deleteProfile();
    }
}

// פונקציה למחיקת הפרופיל
function deleteProfile() {
    console.log('Starting profile deletion...');
    
    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('אין הרשאה למחיקת פרופיל', 'danger');
        return;
    }
    
    // הצגת טעינה
    const deleteBtn = document.getElementById('deleteProfileBtn');
    const originalText = deleteBtn.innerHTML;
    deleteBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>מוחק...';
    deleteBtn.disabled = true;
    
    // שליחה לשרת
    fetch(API_CONFIG.getUrl('/users/profile'), {
        method: 'DELETE',
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
        console.log('Profile deleted:', data);
        
        // ניקוי מיידי של כל הנתונים המקומיים
        localStorage.clear(); // מחיקת כל הנתונים
        sessionStorage.clear(); // מחיקת נתוני session
        
        // הצגת הודעת הצלחה
        showMessage('החשבון נמחק בהצלחה! מעביר לדף הבית...', 'success');
        
        // מעבר מיידי לדף הבית
        setTimeout(() => {
            CLIENT_NAV.goHome();
        }, 1000);
    })
    .catch(error => {
        console.error('שגיאה במחיקת פרופיל:', error);
        showMessage('שגיאה במחיקת הפרופיל', 'danger');
        
        // החזרת כפתור למצב רגיל
        deleteBtn.innerHTML = originalText;
        deleteBtn.disabled = false;
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
    CLIENT_NAV.goHome();
}

// הגדרת מאזיני אירועים
function setupEventListeners() {
    console.log('Setting up event listeners for profile page...');
    
    // טופס עדכון פרופיל
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', updateProfile);
    }
    
    // Geolocation button event listener
    if (detectLocationBtn && cityInput) {
        console.log('Setting up listener for location detection button');
        detectLocationBtn.addEventListener('click', async function() {
            console.log('Location detection button clicked');
            
            let originalText = detectLocationBtn.innerHTML;
            detectLocationBtn.innerHTML = '<i class="bi bi-hourglass-split"></i>';
            detectLocationBtn.disabled = true;
            
            try {
                const city = await window.geolocationService.autoDetectCity(cityInput);
                console.log('City detected:', city);
            } catch (error) {
                console.error('שגיאה בזיהוי מיקום:', error);
            } finally {
                detectLocationBtn.innerHTML = originalText;
                detectLocationBtn.disabled = false;
            }
        });
    } else {
        console.log('Location detection button or city field not found');
    }
    
    console.log('Event listeners configured');
}

// אתחול הדף
document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile page loaded - starting initialization...');
    
    // בדיקת נתונים ב-localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    console.log('=== Data Check ===');
    console.log('Token exists:', !!token);
    console.log('User data exists:', !!userData);
    
    if (userData) {
        try {
            const parsedData = JSON.parse(userData);
            console.log('Parsed user data:', parsedData);
            
            // בדיקה אם הנתונים תקינים
            if (parsedData.firstName && parsedData.email) {
                console.log('Data is valid - starting load');
                currentUser = parsedData;
                loadUserData(); // קריאה לפונקציה המרכזית
                
                // Set up auth buttons for logged-in user
                const authButtons = document.getElementById('authButtons');
                if (authButtons) {
                    authButtons.innerHTML = `
                        <li class="nav-item d-flex align-items-center">
                            <span class="navbar-text me-3 text-light">
                                שלום, ${parsedData.firstName || 'משתמש'}!
                            </span>
                        </li>
                        <li class="nav-item d-flex align-items-center">
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
                        CLIENT_NAV.goToProfile();
                    };
                }
                
                // Setup role-based navigation menu
                setupRoleBasedMenu(parsedData.userType);
            } else {
                console.error('נתונים חסרים - מעביר להתחברות');
                CLIENT_NAV.goHome();
            }
        } catch (error) {
            console.error('שגיאה בפענוח נתונים:', error);
            CLIENT_NAV.goHome();
        }
    } else {
        console.error('אין נתוני משתמש - מעביר להתחברות');
        CLIENT_NAV.goHome();
    }
    
    // הגדרת מאזיני אירועים
    setupEventListeners();
    
    console.log('Profile page initialized successfully!');
}); 