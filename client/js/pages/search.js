const API_BASE_URL = 'http://localhost:3000/api'
const searchForm = document.getElementById('searchForm');
const resultsSection = document.getElementById('resultsSection');
const resultsList = document.getElementById('resultsList');
const resultsCount = document.getElementById('resultsCount');
const loading = document.getElementById('loading');
const noResults = document.getElementById('noResults');
const detectLocationBtn = document.getElementById('detectLocationBtn');
const cityInput = document.getElementById('city');
console.log('דף החיפוש נטען!');
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('הטופס נשלח!');
    performSearch();
});
if (detectLocationBtn && cityInput) {
    detectLocationBtn.addEventListener('click', async function() {
        let originalText = detectLocationBtn.innerHTML;
        try {
            detectLocationBtn.innerHTML = '<i class="bi bi-hourglass-split"></i>';
            detectLocationBtn.disabled = true;
            await window.geolocationService.autoDetectCity(cityInput);
            showMessage('העיר זוהתה בהצלחה!', 'success');
        } catch (error) {
            console.error('Error detecting location:', error);
            showMessage(error.message || 'שגיאה בזיהוי המיקום', 'danger');
        } finally {
            detectLocationBtn.innerHTML = originalText;
            detectLocationBtn.disabled = false;
        }
    });
}
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    messageDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    messageDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(messageDiv);
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}
function performSearch() {
    console.log('מתחיל חיפוש...');
    resultsSection.classList.remove('d-none');
    loading.classList.remove('d-none');
    resultsList.classList.add('d-none');
    noResults.classList.add('d-none');
    const formData = new FormData(searchForm);
    const searchParams = new URLSearchParams();
    for (let [key, value] of formData.entries()) {
        if (value.trim() !== '') {
            searchParams.append(key, value.trim());
            console.log('הוספת פרמטר:', key, '=', value);
        }
    }
    const apiUrl = `${API_BASE_URL}/babysitters?${searchParams.toString()}`;
    console.log('כתובת החיפוש:', apiUrl);
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
function displayResults(babysitters) {
    console.log('מציג תוצאות:', babysitters.length, 'בייביסיטרים');
    if (babysitters.length === 0) {
        showNoResults();
        return;
    }
    resultsCount.textContent = `${babysitters.length} ביביסיטרים נמצאו`;
    resultsList.innerHTML = '';
    babysitters.forEach((babysitter, index) => {
        console.log('יוצר כרטיס מספר:', index + 1);
        const babysitterCard = createBabysitterCard(babysitter);
        resultsList.appendChild(babysitterCard);
    });
    resultsList.classList.remove('d-none');
}
function createBabysitterCard(babysitter) {
    const article = document.createElement('article');
    article.className = 'col-md-6 col-lg-4';
    const experienceText = babysitter.babysitter?.experience || 'לא צוין';
    article.innerHTML = `
        <section class="card h-100 shadow-sm">
            <section class="card-body">
                <header class="d-flex justify-content-between align-items-start mb-3">
                    <h5 class="card-title mb-0">${babysitter.firstName} ${babysitter.lastName}</h5>
                </header>
                <section class="mb-3">
                    <p class="card-text text-muted mb-2">
                        <i class="bi bi-geo-alt"></i> ${babysitter.city || 'לא צוין'}
                    </p>
                    <p class="card-text text-muted mb-2">
                        <i class="bi bi-award"></i> ניסיון: ${experienceText}
                    </p>
                    <p class="card-text text-muted mb-2">
                        <i class="bi bi-currency-dollar"></i> ${babysitter.babysitter?.hourlyRate || 'לא צוין'} ₪ לשעה
                    </p>
                    <p class="card-text mb-2 ${babysitter.babysitter?.isAvailable !== false ? 'text-success' : 'text-danger'}">
                        <i class="bi bi-check-circle"></i> ${babysitter.babysitter?.isAvailable !== false ? '✅ זמינה' : '❌ לא זמינה'}
                    </p>
                </section>
                ${babysitter.babysitter?.description ? `
                    <p class="card-text">${babysitter.babysitter.description}</p>
                ` : ''}
            </section>
            <section class="card-footer bg-transparent">
                <section class="d-grid">
                    <button class="btn btn-primary" onclick="startChat('${babysitter._id}')">
                        שלח הודעה
                    </button>
                </section>
            </section>
        </section>
    `;
    return article;
}
function showNoResults() {
    console.log('אין תוצאות חיפוש');
    resultsCount.textContent = '0 ביביסיטרים נמצאו';
    noResults.classList.remove('d-none');
}
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
function startChat(babysitterId) {
    console.log('מתחיל צ\'אט עם:', babysitterId);
    const token = localStorage.getItem('token');
    if (!token) {
        alert('עליכם להתחבר כדי לשלוח הודעה');
        window.location.href = 'login.html';
        return;
    }
    
    // Always go to direct chat - let the chat page handle existing conversations
    console.log('פתיחת צ\'אט ישיר עם:', babysitterId);
    window.location.href = `chat.html?userId=${babysitterId}`;
}
function setupRoleBasedMenu(userType) {
    const navigationMenu = document.getElementById('navigationMenu');
    if (!navigationMenu) return;
    let menuItems = '';
    if (userType === 'parent') {
        menuItems = `
            <li class="nav-item">
                <a class="nav-link active" href="search.html">חיפוש בייביסיטר</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="conversations.html">שיחות</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="about.html">אודות</a>
            </li>
        `;
    } else if (userType === 'babysitter') {
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
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const user = JSON.parse(localStorage.getItem('userData') || '{}');
            if (user.userType === 'babysitter') {
                alert('בייביסיטרים לא יכולים לחפש משתמשים אחרים. מעביר לדף השיחות.');
                window.location.href = 'conversations.html';
                return;
            }
            const authButtons = document.getElementById('authButtons');
            if (authButtons) {
                authButtons.innerHTML = `
                    <li class="nav-item">
                        <span class="navbar-text me-3 text-light">
                            שלום, ${user.firstName || 'משתמש'}!
                        </span>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" onclick="logout()">
                            <i class="bi bi-box-arrow-right"></i> התנתק
                        </a>
                    </li>
                `;
            }
            const homeLink = document.getElementById('homeLink');
            if (homeLink) {
                homeLink.href = 'profile.html';
                homeLink.onclick = function(e) {
                    e.preventDefault();
                    window.location.href = 'profile.html';
                };
            }
            setupRoleBasedMenu(user.userType);
        } catch (error) {
            console.error('שגיאה בפענוח נתוני משתמש:', error);
        }
    } else {
        const homeLink = document.getElementById('homeLink');
        if (homeLink) {
            homeLink.href = '../index.html';
        }
    }
});
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
} 