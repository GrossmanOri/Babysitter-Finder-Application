/**
 * Search Page Component for Babysitter Finder SPA
 * Handles babysitter search functionality
 */

const SearchPage = {
    /**
     * Render the search page
     */
    render(container) {
        console.log('Rendering search page...');
        container.innerHTML = this.getTemplate();
        this.setupEventListeners();
    },

    /**
     * Get the HTML template for the search page
     */
    getTemplate() {
        return `
            <div class="container my-5">
                <h1 class="mb-4">
                    <i class="bi bi-search me-2"></i>
                    חיפוש בייביסיטר
                </h1>

                <!-- Search Form -->
                <div class="card mb-4">
                    <div class="card-body">
                        <form id="searchForm">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label">עיר</label>
                                    <input type="text" class="form-control" id="searchCity" placeholder="הזינו עיר">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">מחיר מקסימלי לשעה (₪)</label>
                                    <input type="number" class="form-control" id="maxPrice" placeholder="200">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">ניסיון</label>
                                    <select class="form-select" id="experience">
                                        <option value="">כל הרמות</option>
                                        <option value="beginner">מתחיל</option>
                                        <option value="intermediate">בינוני</option>
                                        <option value="expert">מומחה</option>
                                    </select>
                                </div>
                                <div class="col-md-2 d-flex align-items-end">
                                    <button type="submit" class="btn btn-primary w-100">
                                        <i class="bi bi-search me-1"></i>חפש
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Results -->
                <div id="searchResults">
                    <div class="text-center py-5">
                        <i class="bi bi-search display-4 text-muted"></i>
                        <p class="text-muted mt-3">השתמשו בחיפוש למעלה כדי למצוא בייביסיטרים</p>
                    </div>
                </div>

                <!-- Loading -->
                <div id="searchLoading" class="text-center py-5 d-none">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">מחפש...</span>
                    </div>
                    <p class="mt-2">מחפש בייביסיטרים...</p>
                </div>
            </div>
        `;
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        console.log('Setting up search page event listeners...');
        
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', this.handleSearch.bind(this));
        }
    },

    /**
     * Handle search form submission
     */
    async handleSearch(event) {
        event.preventDefault();
        console.log('Handling search...');
        
        const formData = new FormData(event.target);
        const searchParams = {
            city: formData.get('searchCity') || '',
            maxPrice: formData.get('maxPrice') || '',
            experience: formData.get('experience') || ''
        };
        
        const resultsContainer = document.getElementById('searchResults');
        const loadingContainer = document.getElementById('searchLoading');
        
        try {
            // Show loading
            if (loadingContainer) loadingContainer.classList.remove('d-none');
            if (resultsContainer) resultsContainer.innerHTML = '';
            
            // Make API call
            const response = await window.apiService.searchBabysitters(searchParams);
            const babysitters = response.data || response.babysitters || [];
            
            console.log('Search results:', babysitters);
            
            // Hide loading
            if (loadingContainer) loadingContainer.classList.add('d-none');
            
            // Display results
            this.displayResults(babysitters);
            
        } catch (error) {
            console.error('Search error:', error);
            
            // Hide loading
            if (loadingContainer) loadingContainer.classList.add('d-none');
            
            // Show error
            if (resultsContainer) {
                resultsContainer.innerHTML = `
                    <div class="alert alert-danger text-center">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        שגיאה בחיפוש. אנא נסו שוב.
                    </div>
                `;
            }
        }
    },

    /**
     * Display search results
     */
    displayResults(babysitters) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;
        
        if (babysitters.length === 0) {
            resultsContainer.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-emoji-frown display-4 text-muted"></i>
                    <h4 class="mt-3">לא נמצאו תוצאות</h4>
                    <p class="text-muted">נסו לשנות את קריטריוני החיפוש</p>
                </div>
            `;
            return;
        }
        
        const resultsHTML = babysitters.map(babysitter => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="card-title">${babysitter.firstName} ${babysitter.lastName}</h5>
                            <span class="badge bg-primary">${babysitter.babysitter?.hourlyRate || 'N/A'}₪/שעה</span>
                        </div>
                        <p class="card-text">
                            <i class="bi bi-geo-alt me-1"></i>${babysitter.city}
                        </p>
                        <p class="card-text">
                            <i class="bi bi-award me-1"></i>${this.getExperienceText(babysitter.babysitter?.experience)}
                        </p>
                        <p class="card-text text-muted small">
                            ${babysitter.babysitter?.description || 'אין תיאור זמין'}
                        </p>
                        <div class="d-grid">
                            <button class="btn btn-outline-primary" onclick="contactBabysitter('${babysitter._id}')">
                                <i class="bi bi-chat-dots me-1"></i>צור קשר
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        resultsContainer.innerHTML = `
            <h4 class="mb-3">נמצאו ${babysitters.length} בייביסיטרים</h4>
            <div class="row">
                ${resultsHTML}
            </div>
        `;
        
        // Make contact function globally available
        window.contactBabysitter = this.contactBabysitter.bind(this);
    },

    /**
     * Get experience text in Hebrew
     */
    getExperienceText(experience) {
        const experienceMap = {
            'beginner': 'מתחיל',
            'intermediate': 'בינוני',
            'expert': 'מומחה'
        };
        return experienceMap[experience] || 'לא צוין';
    },

    /**
     * Contact babysitter
     */
    contactBabysitter(babysitterId) {
        console.log('Contacting babysitter:', babysitterId);
        // This would typically open a chat or contact form
        window.showMessage('פונקציונליות יצירת קשר תמומש בגרסה עתידית', 'info');
    }
};

// Export the component
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchPage;
} else {
    window.SearchPage = SearchPage;
}

console.log('SearchPage component loaded successfully!');