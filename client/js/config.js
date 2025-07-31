// API Configuration
console.log('API_CONFIG loaded - Base URL will be:', window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000/api' : 'https://babysitter-finder-application.onrender.com/api');
console.log('Current hostname:', window.location.hostname);
console.log('Current port:', window.location.port);

const API_CONFIG = {
    // Determine the base URL based on the current environment
    getBaseUrl: function() {
        const hostname = window.location.hostname;
        const port = window.location.port;
        console.log('Config - hostname:', hostname, 'port:', port);
        
                       // Force local development for port 3001 or 3002
               if (port === '3001' || port === '3002' || hostname === 'localhost' || hostname === '127.0.0.1') {
            console.log('Config - Using local development server');
            return 'http://localhost:3000/api';
        } else {
            console.log('Config - Using production server');
            return 'https://babysitter-finder-application.onrender.com/api';
        }
    },
    
    // Get full URL for a specific endpoint
    getUrl: function(endpoint) {
        const url = this.getBaseUrl() + endpoint;
        console.log('API_CONFIG.getUrl called with endpoint:', endpoint, 'returning:', url);
        return url;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
} 