const API_BASE_URL = 'http:
let currentUser = null;
document.addEventListener('DOMContentLoaded', function() {
    console.log('Babysitter Finder loaded successfully');
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});
function initializeApp() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
    const timeInput = document.getElementById('time');
    if (timeInput) {
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                           now.getMinutes().toString().padStart(2, '0');
        timeInput.value = currentTime;
    }
}
function setupEventListeners() {
    const heroSearchForm = document.getElementById('heroSearchForm');
    if (heroSearchForm) {
        heroSearchForm.addEventListener('submit', handleHeroSearch);
    }
    const cityInput = document.getElementById('city');
    if (cityInput) {
        cityInput.addEventListener('input', handleCityAutocomplete);
    }
    setupNavigationListeners();
}
function handleHeroSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const searchData = {
        city: formData.get('city') || document.getElementById('city').value,
        date: formData.get('date') || document.getElementById('date').value,
        time: formData.get('time') || document.getElementById('time').value
    };
    if (!searchData.city || !searchData.date || !searchData.time) {
        showAlert('אנא מלאו את כל השדות הנדרשים', 'warning');
        return;
    }
    const searchParams = new URLSearchParams(searchData);
    window.location.href = `pages/search.html?${searchParams.toString()}`;
}
function handleCityAutocomplete(event) {
    const query = event.target.value.trim();
    if (query.length < 2) {
        hideAutocomplete();
        return;
    }
    fetchCitiesFromAPI(query)
        .then(cities => {
            showCityAutocomplete(cities);
        })
        .catch(error => {
            console.error('Error fetching cities:', error);
            const localCities = getLocalCities().filter(city => 
                city.name.includes(query) || city.name.includes(query)
            );
            showCityAutocomplete(localCities);
        });
}
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
function hideAutocomplete() {
    const existingDropdown = document.querySelector('.autocomplete-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }
}
function setupNavigationListeners() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            this.innerHTML += ' <span class="spinner-border spinner-border-sm"></span>';
            setTimeout(() => {
                const spinner = this.querySelector('.spinner-border');
                if (spinner) {
                    spinner.remove();
                }
            }, 1000);
        });
    });
}
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (token) {
        fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Token invalid');
            }
        })
        .then(data => {
            currentUser = data.user;
            updateNavigationForLoggedInUser();
        })
        .catch(error => {
            console.error('Auth check failed:', error);
            localStorage.removeItem('authToken');
            updateNavigationForLoggedOutUser();
        });
    } else {
        updateNavigationForLoggedOutUser();
    }
}
function updateNavigationForLoggedInUser() {
    const authLinks = document.querySelectorAll('.auth-links');
    const userLinks = document.querySelectorAll('.user-links');
    authLinks.forEach(link => link.style.display = 'none');
    userLinks.forEach(link => link.style.display = 'block');
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        element.textContent = currentUser.firstName;
    });
}
function updateNavigationForLoggedOutUser() {
    const authLinks = document.querySelectorAll('.auth-links');
    const userLinks = document.querySelectorAll('.user-links');
    authLinks.forEach(link => link.style.display = 'block');
    userLinks.forEach(link => link.style.display = 'none');
}
function showAlert(message, type = 'info') {
    const alertContainer = document.createElement('section');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
    alertContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
    `;
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertContainer);
    setTimeout(() => {
        if (alertContainer.parentNode) {
            alertContainer.remove();
        }
    }, 5000);
}
const API = {
    get: function(url) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
    },
    post: function(url, data) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
    },
    put: function(url, data) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
    },
    delete: function(url) {
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
    }
};
const Utils = {
    formatDate: function(date) {
        return new Date(date).toLocaleDateString('he-IL');
    },
    formatTime: function(time) {
        return time.substring(0, 5);
    },
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('he-IL', {
            style: 'currency',
            currency: 'ILS'
        }).format(amount);
    },
    generateStars: function(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="bi bi-star-fill"></i>';
        }
        if (hasHalfStar) {
            starsHTML += '<i class="bi bi-star-half"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="bi bi-star"></i>';
        }
        return starsHTML;
    },
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = function() {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};
window.BabysitterFinder = {
    API,
    Utils,
    currentUser,
    showAlert,
    checkAuthStatus
}; 