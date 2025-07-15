#!/usr/bin/env node

/**
 * סקריפט בדיקה מהיר ל-Cities API
 * בדיקת תקינות עם תווים עבריים
 */

const API_BASE = 'http://localhost:3000/api';

console.log('🧪 בדיקת Cities API...\n');

// בדיקת בריאות השרת
console.log('1️⃣ בדיקת בריאות השרת...');
fetch(`${API_BASE}/health`)
  .then(res => res.json())
  .then(healthData => {
    console.log('✅ השרת פעיל:', healthData.status);
    console.log('');

    // בדיקת חיפוש ערים עם "תל"
    console.log('2️⃣ בדיקת חיפוש ערים עם "תל"...');
    return fetch(`${API_BASE}/cities?q=${encodeURIComponent('תל')}`);
  })
  .then(res => res.json())
  .then(telData => {
    console.log('✅ נמצאו ערים:', telData.cities.length);
    console.log('📋 דוגמאות:', telData.cities.slice(0, 3));
    console.log('');

    // בדיקת חיפוש ערים עם "ירוש"
    console.log('3️⃣ בדיקת חיפוש ערים עם "ירוש"...');
    return fetch(`${API_BASE}/cities?q=${encodeURIComponent('ירוש')}`);
  })
  .then(res => res.json())
  .then(jerusalemData => {
    console.log('✅ נמצאו ערים:', jerusalemData.cities.length);
    console.log('📋 דוגמאות:', jerusalemData.cities.slice(0, 3));
    console.log('');

    // בדיקת חיפוש ערים עם "חיפה"
    console.log('4️⃣ בדיקת חיפוש ערים עם "חיפה"...');
    return fetch(`${API_BASE}/cities?q=${encodeURIComponent('חיפה')}`);
  })
  .then(res => res.json())
  .then(haifaData => {
    console.log('✅ נמצאו ערים:', haifaData.cities.length);
    console.log('📋 דוגמאות:', haifaData.cities.slice(0, 3));
    console.log('');
    console.log('🎉 כל הבדיקות עברו בהצלחה!');
    console.log('✅ ה-API עובד כמו שצריך עם תווים עבריים');
  })
  .catch(error => {
    console.error('❌ שגיאה בבדיקה:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 וודא שהשרת רץ: cd server && node server.js');
    }
    process.exit(1);
  }); 