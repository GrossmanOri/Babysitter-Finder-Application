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

// Dynamic CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('../client'));
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