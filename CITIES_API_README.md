# Cities API - הוראות שימוש ובדיקה

## 📋 תיאור
זהו API לקבלת ערים בישראל באמצעות GeoDB Cities API מ-RapidAPI. ה-API מאפשר חיפוש ערים לפי שם ומחזיר רשימת ערים ישראליות.

## 🚀 התקנה

### 1. התקנת תלויות
```bash
cd server
npm install
```

### 2. הגדרת משתני סביבה
צור קובץ `.env` בתיקיית `server`:
```env
MONGODB_URI=mongodb://localhost:27017/babysitter-finder
JWT_SECRET=dev-secret-key
RAPID_API_KEY=b1abf7d8c9msh7a15780d68eb05dp113017jsn5bcc3e2dce0c
RAPID_API_HOST=wft-geo-db.p.rapidapi.com
```

### 3. הפעלת השרת
```bash
npm start
```

## 📡 נתיבי API

### 1. חיפוש ערים
**GET** `/api/cities?q=תל`

**פרמטרים:**
- `q` (required): טקסט לחיפוש (לפחות 2 תווים)

**תגובה:**
```json
{
  "success": true,
  "cities": ["תל אביב", "תל מונד", "תל שבע"]
}
```

### 2. ערים פופולריות
**GET** `/api/cities/popular`

**תגובה:**
```json
{
  "success": true,
  "cities": [
    "תל אביב",
    "ירושלים",
    "חיפה",
    "באר שבע",
    "אשדוד",
    "נתניה",
    "ראשון לציון",
    "פתח תקווה",
    "אשקלון",
    "רחובות"
  ]
}
```

### 3. מידע על עיר ספציפית
**GET** `/api/cities/תל אביב`

**תגובה:**
```json
{
  "success": true,
  "city": {
    "name": "Tel Aviv",
    "country": "Israel",
    "region": "Tel Aviv",
    "population": 432892,
    "latitude": 32.0853,
    "longitude": 34.7818
  }
}
```

### 4. בדיקת בריאות
**GET** `/api/cities/health`

**תגובה:**
```json
{
  "success": true,
  "message": "Cities API is working",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "apiKey": "Configured",
  "apiHost": "Configured"
}
```

## 🧪 בדיקה עם Postman

### 1. חיפוש ערים
```
Method: GET
URL: http://localhost:3000/api/cities?q=תל
Headers: (אין צורך)
```

### 2. ערים פופולריות
```
Method: GET
URL: http://localhost:3000/api/cities/popular
Headers: (אין צורך)
```

### 3. מידע על עיר
```
Method: GET
URL: http://localhost:3000/api/cities/ירושלים
Headers: (אין צורך)
```

## 🧪 בדיקה עם curl

### 1. חיפוש ערים
```bash
curl "http://localhost:3000/api/cities?q=תל"
```

### 2. ערים פופולריות
```bash
curl "http://localhost:3000/api/cities/popular"
```

### 3. מידע על עיר
```bash
curl "http://localhost:3000/api/cities/חיפה"
```

### 4. בדיקת בריאות
```bash
curl "http://localhost:3000/api/cities/health"
```

## 🧪 בדיקה עם JavaScript

### 1. חיפוש ערים
```javascript
fetch('http://localhost:3000/api/cities?q=תל')
  .then(response => response.json())
  .then(data => {
    console.log('ערים שנמצאו:', data.cities);
  })
  .catch(error => {
    console.error('שגיאה:', error);
  });
```

### 2. ערים פופולריות
```javascript
fetch('http://localhost:3000/api/cities/popular')
  .then(response => response.json())
  .then(data => {
    console.log('ערים פופולריות:', data.cities);
  });
```

## ⚠️ שגיאות נפוצות

### 1. API Key לא תקין
```json
{
  "success": false,
  "message": "שגיאה בהרשאות API - בדוק את ה-API key"
}
```

### 2. פרמטר חיפוש חסר
```json
{
  "success": false,
  "message": "פרמטר חיפוש (q) נדרש"
}
```

### 3. פרמטר חיפוש קצר מדי
```json
{
  "success": false,
  "message": "פרמטר חיפוש חייב להכיל לפחות 2 תווים"
}
```

### 4. שגיאת חיבור
```json
{
  "success": false,
  "message": "שגיאה בחיבור ל-GeoDB API - בדוק את החיבור לאינטרנט"
}
```

## 🔧 פתרון בעיות

### 1. השרת לא עולה
- בדוק שה-Node.js מותקן
- בדוק שכל התלויות מותקנות: `npm install`
- בדוק שקובץ `.env` קיים עם כל המשתנים הנדרשים

### 2. API לא עובד
- בדוק שה-RapidAPI key תקין
- בדוק שה-RapidAPI host נכון
- בדוק את החיבור לאינטרנט

### 3. אין תוצאות חיפוש
- בדוק שהטקסט לחיפוש מכיל לפחות 2 תווים
- בדוק שהטקסט בעברית
- בדוק שה-API key פעיל

## 📝 הערות חשובות

1. **API Key**: יש להשתמש ב-API key תקין מ-RapidAPI
2. **מגבלות**: ה-API מוגבל ל-10 תוצאות לכל חיפוש
3. **ערים**: רק ערים בישראל מוחזרות
4. **ביצועים**: יש cache של 5 דקות לתוצאות פופולריות

## 🎯 דוגמאות שימוש

### חיפוש ערים שמתחילות ב"תל":
```bash
curl "http://localhost:3000/api/cities?q=תל"
```

### חיפוש ערים שמתחילות ב"ירוש":
```bash
curl "http://localhost:3000/api/cities?q=ירוש"
```

### קבלת רשימת ערים פופולריות:
```bash
curl "http://localhost:3000/api/cities/popular"
```

### קבלת מידע על תל אביב:
```bash
curl "http://localhost:3000/api/cities/תל%20אביב"
```

## 🔗 קישורים שימושיים

- [GeoDB Cities API Documentation](https://rapidapi.com/wirefreetech/api/geodb-cities/)
- [RapidAPI Dashboard](https://rapidapi.com/hub)
- [Express.js Documentation](https://expressjs.com/)
- [Axios Documentation](https://axios-http.com/)

---

**הערה:** זהו API לפיתוח בלבד. לפרודקשן יש להוסיף אבטחה נוספת ו-rate limiting. 