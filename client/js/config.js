// API Configuration
const API_CONFIG = {
    // Determine the base URL based on the current environment
    getBaseUrl: function() {
        const hostname = window.location.hostname;
        const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
        
        return isLocal 
            ? 'http://localhost:3000/api' 
            : 'https://babysitter-finder-application.onrender.com/api';
    },
    
    // Get full URL for a specific endpoint
    getUrl: function(endpoint) {
        return this.getBaseUrl() + endpoint;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
} 