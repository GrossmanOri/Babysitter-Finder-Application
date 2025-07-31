/**
 * Simple Client-Side Router for Babysitter Finder SPA
 * Handles navigation without page reloads
 */

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.init();
    }

    init() {
        // Listen for back/forward button clicks
        window.addEventListener('popstate', (e) => {
            this.loadRoute(window.location.pathname);
        });

        // Listen for link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                const route = e.target.getAttribute('data-route');
                this.navigate(route);
            }
        });

        // Load initial route
        this.loadRoute(window.location.pathname);
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path) {
        // Update browser URL without reload
        window.history.pushState({}, '', path);
        this.loadRoute(path);
    }

    loadRoute(path) {
        console.log('Loading route:', path);
        
        // Default to home if path is empty or root
        if (path === '' || path === '/') {
            path = '/home';
        }

        this.currentRoute = path;
        
        // Check if user needs to be authenticated for this route
        const protectedRoutes = ['/profile', '/search', '/conversations', '/chat'];
        const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
        
        if (isProtectedRoute && !this.isUserLoggedIn()) {
            console.log('Protected route accessed without login, redirecting to home');
            this.navigate('/home');
            return;
        }

        // Find and execute route handler
        const handler = this.routes[path];
        if (handler) {
            handler();
        } else {
            // Try to find a partial match for dynamic routes
            const dynamicHandler = this.findDynamicRoute(path);
            if (dynamicHandler) {
                dynamicHandler(path);
            } else {
                console.log('Route not found:', path);
                this.show404();
            }
        }
    }

    findDynamicRoute(path) {
        // Handle dynamic routes like /chat/:id
        if (path.startsWith('/chat/') && path.length > 6) {
            return this.routes['/chat/:id'];
        }
        return null;
    }

    isUserLoggedIn() {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        return !!(token && userData);
    }

    show404() {
        const appContainer = document.getElementById('app-content');
        if (appContainer) {
            appContainer.innerHTML = `
                <div class="container text-center py-5">
                    <h1 class="display-4">404</h1>
                    <p class="lead">הדף שחיפשת לא נמצא</p>
                    <a href="#" data-route="/home" class="btn btn-primary">חזרה לדף הבית</a>
                </div>
            `;
        }
    }

    getCurrentRoute() {
        return this.currentRoute;
    }
}

// Create global router instance
window.router = new Router();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Router;
}