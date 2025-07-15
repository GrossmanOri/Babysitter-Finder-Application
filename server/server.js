const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// יצירת אפליקציית Express
const app = express();
const PORT = process.env.PORT || 3000;

console.log('מתחיל את השרת...');

// Middleware - תוכנה ביניים
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// חיבור למסד הנתונים - Database connection
console.log('מתחבר למסד הנתונים...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/babysitter-finder', {
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

// Routes - נתיבי ה-API
console.log('מגדיר נתיבי API...');
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/babysitters', require('./routes/babysitters'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/cities', require('./routes/cities'));

// Health check endpoint - בדיקת בריאות השרת
app.get('/api/health', (req, res) => {
  console.log('בדיקת בריאות השרת...');
  res.json({ 
    status: 'OK', 
    message: 'Babysitter Finder API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware - טיפול בשגיאות
app.use((err, req, res, next) => {
  console.error('שגיאה בשרת:', err.stack);
  console.log('פרטי השגיאה:', err.message);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler - טיפול בנתיבים לא קיימים
app.use('*', (req, res) => {
  console.log('נתיב לא נמצא:', req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
  console.log('השרת פועל בהצלחה!');
});

// הוספת פונקציה לבדיקת מצב השרת
function checkServerStatus() {
  console.log('מצב השרת: פעיל');
  console.log('זמן הפעלה:', new Date().toLocaleString('he-IL'));
}

// בדיקת מצב כל 5 דקות
setInterval(checkServerStatus, 5 * 60 * 1000); 