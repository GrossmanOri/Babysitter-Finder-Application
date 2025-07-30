const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/default');
require('dotenv').config();
const app = express();
const PORT = config.server.port;
console.log('מתחיל את השרת...');
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
console.log('מתחבר למסד הנתונים...');
mongoose.connect(config.mongodb.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log('החיבור למסד הנתונים הצליח!');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.log('שגיאה בחיבור למסד הנתונים:', err.message);
});
console.log('מגדיר נתיבי API...');
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/babysitters', require('./routes/babysitters'));
app.use('/api/messages', require('./routes/messages'));
app.get('/api/health', (req, res) => {
  console.log('בדיקת בריאות השרת...');
  res.json({
    status: 'OK',
    message: 'Babysitter Finder API is running',
    timestamp: new Date().toISOString()
  });
});
app.use((err, req, res, next) => {
  console.error('שגיאה בשרת:', err.stack);
  console.log('פרטי השגיאה:', err.message);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});
app.use('*', (req, res) => {
  console.log('נתיב לא נמצא:', req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
  console.log('השרת פועל בהצלחה!');
});
function checkServerStatus() {
  console.log('מצב השרת: פעיל');
  console.log('זמן הפעלה:', new Date().toLocaleString('he-IL'));
}
setInterval(checkServerStatus, 5 * 60 * 1000); 