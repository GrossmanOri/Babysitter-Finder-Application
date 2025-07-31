# API Configuration with Environment Variables

This directory contains configuration files for the Babysitter Finder application API settings.

## Configuration Methods

### 1. Environment Variables (Recommended)

Set environment variables in your deployment environment:

```bash
# For local development
export API_BASE_URL="http://localhost:3000/api"
export NODE_ENV="development"

# For production
export API_BASE_URL="https://babysitter-finder-application.onrender.com/api"
export NODE_ENV="production"

# For custom API server
export API_BASE_URL="https://your-custom-api.com/api"
export API_SERVER_URL="https://your-backup-api.com/api"
```

### 2. Configuration File

Create or modify `client/config/api-config.json`:

```json
{
  "API_BASE_URL": "http://localhost:3000/api",
  "API_SERVER_URL": "https://babysitter-finder-application.onrender.com/api",
  "NODE_ENV": "development"
}
```

### 3. Runtime Configuration

Use the API_CONFIG methods in your JavaScript code:

```javascript
// Set API URL manually
API_CONFIG.setBaseUrl('https://your-custom-api.com/api');

// Get current configuration
const config = API_CONFIG.getConfig();
console.log('Current API base URL:', config.baseUrl);

// Load configuration from file
API_CONFIG.loadConfigFromFile('/config/api-config.json');
```

## Configuration Priority

The API_CONFIG follows this priority order:

1. **Manual override** - `API_CONFIG.setBaseUrl(url)`
2. **Environment variables** - `process.env.API_BASE_URL`
3. **Configuration file** - `client/config/api-config.json`
4. **Automatic detection** - Based on hostname and port

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `API_BASE_URL` | Primary API server URL | `https://api.example.com/api` |
| `API_SERVER_URL` | Backup API server URL | `https://backup-api.example.com/api` |
| `NODE_ENV` | Environment name | `development`, `staging`, `production` |

## Usage Examples

### Local Development
```bash
export API_BASE_URL="http://localhost:3000/api"
export NODE_ENV="development"
```

### Production Deployment
```bash
export API_BASE_URL="https://babysitter-finder-application.onrender.com/api"
export NODE_ENV="production"
```

### Custom API Server
```bash
export API_BASE_URL="https://your-custom-api.com/api"
export NODE_ENV="production"
```

## Testing Configuration

You can test your configuration by checking the browser console:

```javascript
// Check current configuration
console.log(API_CONFIG.getConfig());

// Test API URL generation
console.log(API_CONFIG.getUrl('/users/profile'));
```

## Troubleshooting

1. **Check environment variables**: Ensure they are set correctly
2. **Verify configuration file**: Check `client/config/api-config.json` exists and is valid JSON
3. **Browser console**: Look for configuration logs in the browser console
4. **Network requests**: Check if API requests are going to the correct URL 