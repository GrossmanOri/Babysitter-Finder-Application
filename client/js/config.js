// API Configuration
console.log('API_CONFIG loaded - Base URL will be:', window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000/api' : 'https://babysitter-finder-application.onrender.com/api');
console.log('Current hostname:', window.location.hostname);
console.log('Current port:', window.location.port);

const API_CONFIG = {
    // Environment variables for API configuration (browser-compatible)
    ENV: {
        API_BASE_URL: null, // Will be set from config file or defaults
        API_SERVER_URL: null, // Will be set from config file or defaults
        NODE_ENV: 'development' // Default to development
    },

    // Determine the base URL based on the current environment
    getBaseUrl: function() {
        const hostname = window.location.hostname;
        const port = window.location.port;
        console.log('Config - hostname:', hostname, 'port:', port);
        console.log('Config - Environment variables:', this.ENV);
        
        // Check for environment variable override first
        if (this.ENV.API_BASE_URL) {
            console.log('Config - Using API_BASE_URL from environment:', this.ENV.API_BASE_URL);
            return this.ENV.API_BASE_URL;
        }
        
        if (this.ENV.API_SERVER_URL) {
            console.log('Config - Using API_SERVER_URL from environment:', this.ENV.API_SERVER_URL);
            return this.ENV.API_SERVER_URL;
        }
        
        // Fallback to automatic detection
        if (port === '3001' || port === '3002' || hostname === 'localhost' || hostname === '127.0.0.1') {
            console.log('Config - Using local development server');
            return 'http://localhost:3000/api';
        } else if (hostname.includes('onrender.com')) {
            console.log('Config - Using production server (onrender.com detected)');
            return 'https://babysitter-finder-application.onrender.com/api';
        } else {
            console.log('Config - Using production server (fallback)');
            return 'https://babysitter-finder-application.onrender.com/api';
        }
    },
    
    // Get full URL for a specific endpoint
    getUrl: function(endpoint) {
        const url = this.getBaseUrl() + endpoint;
        console.log('API_CONFIG.getUrl called with endpoint:', endpoint, 'returning:', url);
        return url;
    },
    
    // Set API base URL manually (for testing or override)
    setBaseUrl: function(url) {
        this.ENV.API_BASE_URL = url;
        console.log('Config - Manually set API_BASE_URL to:', url);
    },
    
    // Get current configuration
    getConfig: function() {
        return {
            baseUrl: this.getBaseUrl(),
            environment: this.ENV.NODE_ENV,
            hostname: window.location.hostname,
            port: window.location.port
        };
    },
    
    // Load configuration from a JSON file (for environment-specific configs)
    loadConfigFromFile: function(configPath = '/config/api-config.json') {
        return fetch(configPath)
            .then(response => response.json())
            .then(config => {
                if (config.API_BASE_URL) {
                    this.ENV.API_BASE_URL = config.API_BASE_URL;
                    console.log('Config - Loaded API_BASE_URL from file:', config.API_BASE_URL);
                }
                if (config.API_SERVER_URL) {
                    this.ENV.API_SERVER_URL = config.API_SERVER_URL;
                    console.log('Config - Loaded API_SERVER_URL from file:', config.API_SERVER_URL);
                }
                if (config.NODE_ENV) {
                    this.ENV.NODE_ENV = config.NODE_ENV;
                    console.log('Config - Loaded NODE_ENV from file:', config.NODE_ENV);
                }
                return config;
            })
            .catch(error => {
                console.log('Config - No external config file found, using defaults');
                return null;
            });
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
} 