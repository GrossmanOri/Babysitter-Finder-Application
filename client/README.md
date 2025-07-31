# Babysitter Finder - Client Application

## Architecture Overview

This is a **Single Page Application (SPA)** built with vanilla HTML, CSS, and JavaScript. The client is completely decoupled from the server and communicates only through REST API calls.

## File Structure

```
client/
├── index.html                 # Main SPA entry point
├── package.json              # Client dependencies and scripts
├── css/
│   └── style.css             # Application styles
├── js/
│   ├── config.js             # Configuration settings
│   ├── bootstrap.bundle.min.js
│   └── utils/
│       └── geolocation.js    # Geolocation utilities
├── src/                      # Application source code
│   ├── app.js               # Main application controller
│   ├── router.js            # Client-side routing system
│   ├── services/
│   │   └── ApiService.js    # Centralized API communication
│   └── pages/               # Page components
│       ├── HomePage.js      # Landing page with auth forms
│       ├── ProfilePage.js   # User profile management
│       ├── SearchPage.js    # Babysitter search
│       ├── AboutPage.js     # About page
│       ├── ConversationsPage.js # Chat conversations list
│       └── ChatPage.js      # Individual chat interface
└── pages/                   # Legacy HTML pages (deprecated)
    ├── profile.html         # ⚠️ Legacy - use SPA routing
    ├── search.html          # ⚠️ Legacy - use SPA routing
    └── ...                  # ⚠️ Other legacy pages
```

## Key Features

### 🔄 Client-Side Routing
- No page reloads - smooth SPA experience
- Browser history support (back/forward buttons)
- Protected routes for authenticated users
- Dynamic URL updates

### 🌐 API Integration
- Centralized `ApiService` for all server communication
- Environment-aware API URLs (localhost vs production)
- Automatic authentication token handling
- Consistent error handling

### 🎨 Component-Based Architecture
- Modular page components
- Reusable UI patterns
- Clean separation of concerns
- Easy to maintain and extend

### 🔐 Authentication
- JWT token-based authentication
- Automatic login state management
- Protected route handling
- Secure logout functionality

## Development

### Prerequisites
```bash
Node.js >= 14.0.0
```

### Installation
```bash
cd client
npm install
```

### Development Server
```bash
npm run dev
# Opens http://localhost:8080
```

### Production Build
```bash
npm run build
# Static files ready for deployment
```

## Routing

### Public Routes
- `/home` - Landing page with authentication
- `/about` - About page

### Protected Routes (require login)
- `/profile` - User profile
- `/search` - Babysitter search
- `/conversations` - Chat conversations
- `/chat/:id` - Individual chat

## API Communication

All server communication goes through the `ApiService`:

```javascript
// Example usage
const response = await window.apiService.login({
  email: 'user@example.com',
  password: 'password'
});
```

### API Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users/profile` - Get user profile
- `GET /api/babysitters` - Search babysitters
- `GET /api/messages/conversations` - Get conversations
- ... and more

## Environment Configuration

The client automatically detects the environment:

- **Local Development**: `http://localhost:3000/api`
- **Production**: `https://babysitter-finder-application.onrender.com/api`

## Migration from Legacy

⚠️ **Important**: The old multi-page HTML files in `/pages/` are deprecated. The application now uses:

- Single entry point: `index.html`
- Client-side routing: No more page redirects
- SPA components: All pages are now JavaScript components

### Legacy Redirect Mapping
- `pages/profile.html` → Route: `/profile`
- `pages/search.html` → Route: `/search`
- `pages/about.html` → Route: `/about`
- `pages/conversations.html` → Route: `/conversations`
- `pages/chat.html` → Route: `/chat/:id`

## Server Independence

✅ **Fully Decoupled**: This client application can run independently of the server:

1. **Separate deployment**: Client can be deployed to any static hosting
2. **Independent development**: Frontend and backend teams can work separately
3. **Different domains**: Client and server can be on different domains
4. **Flexible scaling**: Client and server can be scaled independently

## Troubleshooting

### Common Issues

1. **API calls failing**: Check that the server is running on the correct port
2. **Authentication errors**: Clear localStorage and try logging in again
3. **Routing not working**: Ensure all script files are loaded in the correct order

### Debug Mode
Enable debug logging by opening browser dev tools and checking console output.