# Babysitter Finder - Separate Deployment Guide

This guide explains how to deploy the Babysitter Finder application with separate server and client deployments.

## Architecture Overview

- **Server**: Node.js/Express API server (backend only)
- **Client**: Static HTML/CSS/JavaScript files
- **Communication**: Client makes HTTP requests to server API endpoints

## Server Deployment (Backend)

### Prerequisites
- Node.js 14+
- MongoDB Atlas account
- Render account (or similar hosting service)

### 1. Deploy Server to Render

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure the service**:
   - **Root Directory**: `/server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

4. **Set Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/babysitter-finder
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=production
   CORS_ORIGIN=https://your-client-domain.com
   ```

5. **Deploy**
   - Your server will be available at: `https://babysitter-finder-server.onrender.com`

### 2. Local Server Development

```bash
cd server
npm install
npm run dev
```

Server runs on: `http://localhost:3000`

## Client Deployment (Frontend)

### Option 1: Deploy to Render (Static Site)

1. **Create a new Static Site** on Render
2. **Connect your GitHub repository**
3. **Configure the service**:
   - **Root Directory**: `/client`
   - **Build Command**: `npm run build` (optional, no build needed)
   - **Publish Directory**: `.` (current directory)

4. **Update Configuration**:
   - Update `client/js/config.js` with your server URL:
   ```javascript
   production: 'https://babysitter-finder-server.onrender.com/api'
   ```

5. **Deploy**
   - Your client will be available at: `https://babysitter-finder-client.onrender.com`

### Option 2: Deploy to Netlify

1. **Connect GitHub repository** to Netlify
2. **Configure build settings**:
   - **Base directory**: `client`
   - **Build command**: `npm run build` (optional)
   - **Publish directory**: `client`

3. **Update server URL** in `client/js/config.js`

### Option 3: Deploy to Vercel

1. **Connect GitHub repository** to Vercel
2. **Configure project**:
   - **Root Directory**: `client`
   - **Build Command**: Leave empty (static files)
   - **Output Directory**: Leave empty

3. **Update server URL** in `client/js/config.js`

### Local Client Development

```bash
cd client
npm install
npm run dev
```

Client runs on: `http://localhost:3001`

## Configuration

### Server Configuration

Update `server/server.js` CORS settings with your client URLs:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3001',         // Local client
    'https://your-client-domain.com' // Production client
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

### Client Configuration

Update `client/js/config.js` with your server URLs:

```javascript
const API_CONFIG = {
    SERVER_URLS: {
        local: 'http://localhost:3000/api',
        production: 'https://your-server-domain.com/api'
    }
};
```

## Environment Variables

### Server Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (auto-set by Render) | `3000` |
| `CORS_ORIGIN` | Allowed client origins | `https://client.com,https://client2.com` |

### Client Environment (No environment variables needed)

The client uses static configuration in `js/config.js`.

## API Endpoints

The server provides these API endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/babysitters` - Search babysitters
- `GET /api/messages/conversations` - Get conversations
- `POST /api/messages` - Send message
- `GET /api/health` - Health check

## Testing the Deployment

### 1. Test Server
```bash
curl https://your-server-domain.com/api/health
```

### 2. Test Client
Visit your client URL and try:
- Registration
- Login
- Babysitter search
- Sending messages

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Update server CORS configuration
   - Ensure client URL is in allowed origins

2. **API Calls Failing**:
   - Check client configuration
   - Verify server URL in `config.js`

3. **Database Connection Issues**:
   - Verify MongoDB URI
   - Check MongoDB Atlas network access

4. **Authentication Issues**:
   - Verify JWT_SECRET is set
   - Check token storage in browser

### Development vs Production

| Environment | Server URL | Client URL |
|-------------|------------|------------|
| Development | `http://localhost:3000` | `http://localhost:3001` |
| Production | `https://server.onrender.com` | `https://client.netlify.app` |

## Security Considerations

1. **CORS**: Only allow trusted client domains
2. **HTTPS**: Use HTTPS in production
3. **Environment Variables**: Never commit secrets to code
4. **JWT Secret**: Use a strong, unique secret
5. **Database**: Secure MongoDB Atlas access

## Monitoring

- **Server**: Monitor Render logs for errors
- **Client**: Use browser dev tools to check API calls
- **Database**: Monitor MongoDB Atlas metrics

## Scaling

- **Server**: Render auto-scales based on traffic
- **Client**: CDN distribution for global performance
- **Database**: MongoDB Atlas provides automatic scaling