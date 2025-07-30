// API Configuration for Separate Client/Server Deployment
const API_CONFIG = {
    // Server URLs for different environments
    SERVER_URLS: {
        local: 'http://localhost:3000/api',
        production: 'https://babysitter-finder-application.onrender.com/api'
    },
    
    // Determine the base URL based on the current environment
    getBaseUrl: function() {
        const hostname = window.location.hostname;
        const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
        
        // You can also use environment variables or config files for different deployments
        return isLocal 
            ? this.SERVER_URLS.local
            : this.SERVER_URLS.production;
    },
    
    // Get full URL for a specific endpoint
    getUrl: function(endpoint) {
        return this.getBaseUrl() + endpoint;
    },
    
    // Get server URL without /api suffix
    getServerUrl: function() {
        return this.getBaseUrl().replace('/api', '');
    }
};

// CLIENT NAVIGATION - All navigation should stay within client domain
const CLIENT_NAV = {
    // Navigate to a page relative to current location
    goTo: function(page) {
        const currentPath = window.location.pathname;
        const isInPagesFolder = currentPath.includes('/pages/');
        
        // Determine correct relative path based on current location
        if (page === 'index.html' || page === '../index.html') {
            // Going to home page
            window.location.href = isInPagesFolder ? '../index.html' : 'index.html';
        } else if (page.includes('/')) {
            // Page already has path - use as is
            window.location.href = page;
        } else {
            // Page without path - add correct prefix
            if (isInPagesFolder) {
                // We're in pages folder, navigate to another page in same folder
                window.location.href = page;
            } else {
                // We're in root, navigate to pages folder
                window.location.href = 'pages/' + page;
            }
        }
    },
    
    // Navigate to home page
    goHome: function() {
        this.goTo('index.html');
    },
    
    // Navigate to profile
    goToProfile: function() {
        this.goTo('profile.html');
    },
    
    // Navigate to login (redirect to home with login tab)
    goToLogin: function() {
        const currentPath = window.location.pathname;
        const isInPagesFolder = currentPath.includes('/pages/');
        window.location.href = isInPagesFolder ? '../index.html#login' : 'index.html#login';
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
} 