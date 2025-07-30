const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/default');
require('dotenv').config();
const app = express();
const PORT = config.server.port;
console.log('Starting server...');
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(morgan('combined'));

// Dynamic CORS configuration for separate client/server deployment
const corsOptions = {
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : [
        // Local development
        'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500',
        'http://localhost:8080', 'http://localhost:3001', 'http://127.0.0.1:3001',
        // Production (will be updated with actual client URLs)
        'https://babysitter-finder-client.onrender.com',
        'https://babysitter-finder-application.onrender.com'
      ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Removed static file serving - client will be deployed separately
console.log('Connecting to database...');
mongoose.connect(config.mongodb.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log('Database connection successful!');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.log('Database connection error:', err.message);
  console.log('MongoDB URI:', config.mongodb.uri ? 'Set' : 'Not set');
  // Don't exit the process, let it continue but log the error
});
console.log('Setting up API routes...');
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/babysitters', require('./routes/babysitters'));
app.use('/api/messages', require('./routes/messages'));
app.get('/api/health', (req, res) => {
  console.log('Checking server health...');
  res.json({
    status: 'OK',
    message: 'Babysitter Finder API is running',
    timestamp: new Date().toISOString()
  });
});

// Root route handler - explain this is an API-only server
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.json({
    message: 'Babysitter Finder API Server',
    description: 'This is an API-only server. The client frontend is deployed separately.',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      users: '/api/users/*',
      babysitters: '/api/babysitters/*',
      messages: '/api/messages/*'
    },
    client_url: 'Please access the client application at the appropriate frontend URL',
    documentation: 'Available API endpoints are listed above'
  });
});
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  console.log('Error details:', err.message);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});
app.use('*', (req, res) => {
  console.log('Route not found:', req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
  console.log('Server is running successfully!');
});
function checkServerStatus() {
  console.log('Server status: Active');
  console.log('Runtime:', new Date().toLocaleString('en-US'));
}
setInterval(checkServerStatus, 5 * 60 * 1000); 