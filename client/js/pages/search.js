// API Base URL - כתובת השרת
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements - אלמנטים מהדף
const searchForm = document.getElementById('searchForm');
const resultsSection = document.getElementById('resultsSection');
const resultsList = document.getElementById('resultsList');
const resultsCount = document.getElementById('resultsCount');
const loading = document.getElementById('loading');
const noResults = document.getElementById('noResults');

// בדיקה שהדף נטען
console.log('דף החיפוש נטען!');

// Search Form Handler - טיפול בטופס החיפוש
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('הטופס נשלח!');
    performSearch();
});

// Perform Search Function - פונקציה לביצוע החיפוש
function performSearch() {
    console.log('מתחיל חיפוש...');
    
    // Show loading and results section
    resultsSection.classList.remove('d-none');
    loading.classList.remove('d-none');
    resultsList.classList.add('d-none');
    noResults.classList.add('d-none');
    
    // Get form data - קבלת נתונים מהטופס
    const formData = new FormData(searchForm);
    const searchParams = new URLSearchParams();
    
    // Add non-empty parameters - הוספת פרמטרים לא ריקים
    for (let [key, value] of formData.entries()) {
        if (value.trim() !== '') {
            searchParams.append(key, value.trim());
            console.log('הוספת פרמטר:', key, '=', value);
        }
    }
    
    // Build API URL - בניית כתובת ה-API
    const apiUrl = `${API_BASE_URL}/babysitters?${searchParams.toString()}`;
    console.log('כתובת החיפוש:', apiUrl);
    
    // Fetch babysitters - שליפת בייביסיטרים
    fetch(apiUrl)
        .then(response => {
            console.log('תגובה מהשרת:', response.status);
            if (!response.ok) {
                throw new Error('שגיאה בטעינת נתונים');
            }
            return response.json();
        })
        .then(data => {
            console.log('נתונים שהתקבלו:', data);
            if (data.success) {
                displayResults(data.data);
            } else {
                throw new Error(data.message || 'שגיאה בחיפוש');
            }
        })
        .catch(error => {
            console.error('שגיאה בחיפוש:', error);
            showError('שגיאה בחיפוש ביביסיטרים: ' + error.message);
        })
        .finally(() => {
            loading.classList.add('d-none');
            console.log('החיפוש הסתיים');
        });
}

// Display Results Function - הצגת תוצאות
function displayResults(babysitters) {
    console.log('מציג תוצאות:', babysitters.length, 'בייביסיטרים');
    
    if (babysitters.length === 0) {
        showNoResults();
        return;
    }
    
    // Update results count - עדכון מספר התוצאות
    resultsCount.textContent = `${babysitters.length} ביביסיטרים נמצאו`;
    
    // Clear previous results - ניקוי תוצאות קודמות
    resultsList.innerHTML = '';
    
    // Create babysitter cards - יצירת כרטיסי בייביסיטרים
    babysitters.forEach((babysitter, index) => {
        console.log('יוצר כרטיס מספר:', index + 1);
        const babysitterCard = createBabysitterCard(babysitter);
        resultsList.appendChild(babysitterCard);
    });
    
    // Show results - הצגת התוצאות
    resultsList.classList.remove('d-none');
}

// Create Babysitter Card Function - יצירת כרטיס בייביסיטר
function createBabysitterCard(babysitter) {
    const article = document.createElement('article');
    article.className = 'col-md-6 col-lg-4';
    
    const experienceText = getExperienceText(babysitter.babysitter.experience);
    const ageText = babysitter.babysitter.age ? `${babysitter.babysitter.age} שנים` : 'לא צוין';
    
    // יצירת HTML לכרטיס
    article.innerHTML = `
        <section class="card h-100 shadow-sm">
            <section class="card-body">
                <header class="d-flex justify-content-between align-items-start mb-3">
                    <h5 class="card-title mb-0">${babysitter.firstName} ${babysitter.lastName}</h5>
                    <span class="badge bg-primary">${experienceText}</span>
                </header>
                
                <section class="mb-3">
                    <p class="card-text text-muted mb-2">
                        <i class="bi bi-geo-alt"></i> ${babysitter.babysitter.city}
                    </p>
                    <p class="card-text text-muted mb-2">
                        <i class="bi bi-person"></i> גיל: ${ageText}
                    </p>
                    <p class="card-text text-muted mb-2">
                        <i class="bi bi-currency-dollar"></i> ${babysitter.babysitter.hourlyRate} ₪ לשעה
                    </p>
                </section>
                
                ${babysitter.babysitter.description ? `
                    <p class="card-text">${babysitter.babysitter.description}</p>
                ` : ''}
            </section>
            
            <section class="card-footer bg-transparent">
                <section class="d-flex gap-2">
                    <button class="btn btn-outline-primary flex-fill" onclick="viewProfile('${babysitter._id}')">
                        צפה בפרופיל
                    </button>
                    <button class="btn btn-primary flex-fill" onclick="startChat('${babysitter._id}')">
                        שלח הודעה
                    </button>
                </section>
            </section>
        </section>
    `;
    
    return article;
}

// Get Experience Text Function - המרת רמת ניסיון לטקסט
function getExperienceText(experience) {
    const experienceMap = {
        'beginner': 'מתחיל',
        'intermediate': 'בינוני',
        'expert': 'מומחה'
    };
    return experienceMap[experience] || 'לא צוין';
}

// Show No Results Function - הצגת הודעה שאין תוצאות
function showNoResults() {
    console.log('אין תוצאות חיפוש');
    resultsCount.textContent = '0 ביביסיטרים נמצאו';
    noResults.classList.remove('d-none');
}

// Show Error Function - הצגת שגיאה
function showError(message) {
    console.error('שגיאה:', message);
    resultsCount.textContent = 'שגיאה';
    noResults.innerHTML = `
        <i class="bi bi-exclamation-triangle display-1 text-danger"></i>
        <h4 class="mt-3">שגיאה</h4>
        <p class="text-muted">${message}</p>
    `;
    noResults.classList.remove('d-none');
}

// View Profile Function - צפייה בפרופיל
function viewProfile(babysitterId) {
    console.log('צפייה בפרופיל של:', babysitterId);
    
    // Check if user is logged in - בדיקה אם המשתמש מחובר
    const token = localStorage.getItem('token');
    if (!token) {
        alert('עליכם להתחבר כדי לצפות בפרופיל');
        window.location.href = 'login.html';
        return;
    }
    
    window.location.href = `profile.html?id=${babysitterId}`;
}

// Start Chat Function - התחלת צ'אט
function startChat(babysitterId) {
    console.log('מתחיל צ\'אט עם:', babysitterId);
    
    // Check if user is logged in - בדיקה אם המשתמש מחובר
    const token = localStorage.getItem('token');
    if (!token) {
        alert('עליכם להתחבר כדי לשלוח הודעה');
        window.location.href = 'login.html';
        return;
    }
    
    window.location.href = `chat.html?userId=${babysitterId}`;
}

// Load Cities Function - טעינת ערים (להשלמה אוטומטית)
function loadCities() {
    console.log('טוען רשימת ערים...');
    
    fetch(`${API_BASE_URL}/babysitters/cities/list`)
        .then(response => response.json())
        .then(data => {
            console.log('ערים שהתקבלו:', data);
            if (data.success) {
                setupCityAutocomplete(data.data);
            }
        })
        .catch(error => {
            console.error('שגיאה בטעינת ערים:', error);
        });
}

// Setup City Autocomplete Function
function setupCityAutocomplete(cities) {
    const cityInput = document.getElementById('city');
    const datalist = document.createElement('datalist');
    datalist.id = 'citiesList';
    
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        datalist.appendChild(option);
    });
    
    cityInput.setAttribute('list', 'citiesList');
    document.body.appendChild(datalist);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Load cities for autocomplete
    loadCities();
    
    // Check if user is logged in and update navigation
    const token = localStorage.getItem('token');
    if (token) {
        // Update navigation for logged in users
        const nav = document.querySelector('nav section:last-child');
        nav.innerHTML = `
            <a href="../index.html" class="btn btn-outline-light">דף הבית</a>
            <a href="dashboard.html" class="btn btn-outline-light">הלוח שלי</a>
            <a href="chat.html" class="btn btn-outline-light">הודעות</a>
            <button class="btn btn-light" onclick="logout()">התנתק</button>
        `;
    }
});

// Logout Function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
} 