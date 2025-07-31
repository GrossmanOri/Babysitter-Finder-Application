// Geolocation Service for Babysitter Finder
// Handles location detection and city identification using Google Geocoding API

/**
 * GeolocationService class
 * Provides functionality for detecting user location and converting coordinates to city names
 */
class GeolocationService {
    /**
     * Constructor - initializes the service with API configuration
     */
    constructor() {
        // Google Geocoding API key
        this.apiKey = 'AIzaSyDXkjRYX9momRN8JzqKObDdtsRc9MlmNOY';
        // Google Geocoding API endpoint
        this.geocodingUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    }

    /**
     * Requests location permission from the user
     * @returns {Promise<Object>} Promise that resolves with coordinates {latitude, longitude}
     */
    async requestLocationPermission() {
        return new Promise((resolve, reject) => {
            // Check if geolocation is supported
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            // Check if permissions API is available
            if (navigator.permissions) {
                navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
                    if (permissionStatus.state === 'granted') {
                        // Permission already granted, get position
                        this.getCurrentPosition(resolve, reject);
                    } else if (permissionStatus.state === 'denied') {
                        // Permission denied
                        reject(new Error('הגישה למיקום נדחתה. אנא אפשרו גישה למיקום בהגדרות הדפדפן'));
                    } else {
                        // Permission not determined, request it
                        this.getCurrentPosition(resolve, reject);
                    }
                });
            } else {
                // Permissions API not available, try to get position directly
                this.getCurrentPosition(resolve, reject);
            }
        });
    }

    /**
     * Gets current position using browser geolocation API
     * @param {Function} resolve - Promise resolve function
     * @param {Function} reject - Promise reject function
     */
    getCurrentPosition(resolve, reject) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Success callback
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                // Error callback - handle different error types
                let errorMessage = '';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'הגישה למיקום נדחתה. אנא אפשרו גישה למיקום בדפדפן.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'מידע על המיקום אינו זמין.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'פג תוקף בקשת המיקום.';
                        break;
                    default:
                        errorMessage = 'שגיאה לא ידועה בקבלת המיקום.';
                }
                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true,  // Request high accuracy
                timeout: 10000,           // 10 second timeout
                maximumAge: 60000         // Cache position for 1 minute
            }
        );
    }

    /**
     * Converts coordinates to city name using Google Geocoding API
     * @param {number} latitude - Latitude coordinate
     * @param {number} longitude - Longitude coordinate
     * @returns {Promise<string>} Promise that resolves with city name
     */
    async getCityFromCoordinates(latitude, longitude) {
        try {
            // Build API URL with parameters
            const url = `${this.geocodingUrl}?latlng=${latitude},${longitude}&key=${this.apiKey}&language=iw&result_type=locality`;
            console.log('Fetching city from coordinates:', latitude, longitude);
            
            // Make API request
            const response = await fetch(url);
            const data = await response.json();
            console.log('Geocoding API response:', data);

            if (data.status === 'OK' && data.results.length > 0) {
                // Success - extract city name from results
                const result = data.results[0];
                const localityComponent = result.address_components.find(component => 
                    component.types.includes('locality')
                );
                
                if (localityComponent) {
                    console.log('Found city:', localityComponent.long_name);
                    return localityComponent.long_name;
                } else {
                    // Fallback to first part of formatted address
                    const city = result.formatted_address.split(',')[0];
                    console.log('Using fallback city:', city);
                    return city;
                }
            } else if (data.status === 'REQUEST_DENIED') {
                // API key error
                console.error('API key error:', data.error_message);
                throw new Error('שגיאה בהרשאות API - אנא בדקו את מפתח ה-API');
            } else {
                // Other API errors
                console.error('Geocoding API error:', data.status, data.error_message);
                throw new Error('לא ניתן לקבל את שם העיר מהמיקום הנוכחי');
            }
        } catch (error) {
            console.error('Error getting city from coordinates:', error);
            if (error.message.includes('API')) {
                throw error;
            }
            throw new Error('שגיאה בקבלת שם העיר מהמיקום');
        }
    }

    /**
     * Gets the user's city by detecting location and converting to city name
     * @returns {Promise<string>} Promise that resolves with city name
     */
    async getUserCity() {
        try {
            // Get user's position
            const position = await this.requestLocationPermission();
            // Convert coordinates to city name
            const city = await this.getCityFromCoordinates(position.latitude, position.longitude);
            return city;
        } catch (error) {
            console.error('Error getting user city:', error);
            
            // Fallback to random Israeli city if geolocation fails
            const defaultCities = ['תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'אשדוד', 'נתניה', 'פתח תקווה', 'ראשון לציון'];
            const randomCity = defaultCities[Math.floor(Math.random() * defaultCities.length)];
            console.log('Using fallback city:', randomCity);
            return randomCity;
        }
    }

    /**
     * Automatically detects and fills city in an input element
     * @param {HTMLElement} inputElement - The input element to fill with city name
     * @returns {Promise<string>} Promise that resolves with detected city name
     */
    async autoDetectCity(inputElement) {
        try {
            // Store original value and show loading state
            const originalText = inputElement.value;
            inputElement.value = 'מזהה מיקום...';
            inputElement.disabled = true;

            // Get city name
            const city = await this.getUserCity();
            
            // Update input element
            inputElement.value = city;
            inputElement.disabled = false;
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Show success message
            this.showMessage('העיר זוהתה בהצלחה!', 'success');
            return city;
        } catch (error) {
            console.error('Error auto-detecting city:', error);
            inputElement.disabled = false;
            
            // Check if it's a permission denied error
            if (error.message.includes('נדחתה') || error.message.includes('denied')) {
                const helpMessage = `
                    <div>
                        <strong>גישה למיקום נדחתה</strong><br>
                        <small>כדי לאפשר גישה למיקום:</small><br>
                        <small>• Chrome: לחצו על 🔒 בסרגל הכתובת → "מיקום" → "אפשר"</small><br>
                        <small>• Safari: העדפות → פרטיות → שירותי מיקום → אפשר</small><br>
                        <small>• Firefox: לחצו על 🔒 בסרגל הכתובת → "מיקום" → "אפשר"</small>
                    </div>
                `;
                this.showMessage(helpMessage, 'warning');
            } else {
                this.showMessage(error.message, 'error');
            }
            
            // Use fallback city instead of returning null
            const defaultCities = ['תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'אשדוד', 'נתניה', 'פתח תקווה', 'ראשון לציון'];
            const fallbackCity = defaultCities[Math.floor(Math.random() * defaultCities.length)];
            
            // Update input with fallback city
            inputElement.value = fallbackCity;
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Show fallback message
            this.showMessage(`השתמשתי בעיר ברירת מחדל: ${fallbackCity}`, 'info');
            
            return fallbackCity;
        }
    }

    /**
     * Shows a temporary message to the user
     * @param {string} message - Message to display
     * @param {string} type - Message type ('info', 'success', 'error')
     */
    showMessage(message, type = 'info') {
        // Remove existing message if present
        const existingMessage = document.querySelector('.geolocation-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `alert alert-${type === 'error' ? 'danger' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'info'} geolocation-message`;
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            font-size: 14px;
            line-height: 1.4;
        `;
        
        // Check if message contains HTML
        if (message.includes('<')) {
            messageElement.innerHTML = message;
        } else {
            messageElement.innerHTML = `
                <i class="bi bi-${type === 'error' ? 'exclamation-triangle' : type === 'warning' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                ${message}
            `;
        }

        // Add to page and auto-remove after 5 seconds for warning messages, 3 seconds for others
        document.body.appendChild(messageElement);
        const timeout = type === 'warning' ? 5000 : 3000;
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, timeout);
    }
}

// Create global instance for easy access
window.geolocationService = new GeolocationService(); 