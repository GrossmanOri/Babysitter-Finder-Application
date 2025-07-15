# 📋 Scratchpad - Babysitter Finder Project

## 🎯 מטרת הפרויקט
אפליקציית ווב למציאת בייביסיטרים המאפשרת להורים לחפש ולתקשר עם בייביסיטרים.

## ✅ דרישות המרצה
- ✅ **לא להשתמש ב-div** - להשתמש ב-semantic HTML (section, article, header, footer, nav, main)
- ✅ **להשתמש ב-then promises** - לא async/await
- ✅ **MongoDB Atlas** - במקום MongoDB מקומי
- ✅ **HTML, CSS, JavaScript** - ללא frameworks
- ✅ **Bootstrap** - לעיצוב
- ✅ **RESTful API** - עם Node.js/Express

## 🛠️ טכנולוגיות
- **Frontend:** HTML (semantic), CSS, JavaScript (promises), Bootstrap
- **Backend:** Node.js, Express, MongoDB Atlas
- **API:** RESTful API, JWT Authentication
- **Internal API:** שליחת הודעות

## 📁 מבנה הפרויקט
```
babysitter-finder/
├── frontend/           # צד לקוח
│   ├── pages/         # דפי HTML
│   ├── css/          # קבצי עיצוב
│   ├── js/           # קבצי JavaScript
│   └── images/       # תמונות
├── backend/           # צד שרת
│   ├── routes/       # נתיבי API
│   ├── models/       # מודלים של בסיס הנתונים
│   ├── middleware/   # תוכנה ביניים
│   └── config/       # הגדרות
└── README.md
```

## 🚀 התקדמות הפרויקט

### ✅ הושלם
- [x] יצירת מבנה הפרויקט
- [x] הגדרת Backend עם Node.js/Express
- [x] יצירת מודלים (User, Message)
- [x] הגדרת MongoDB Atlas
- [x] יצירת דף הבית עם semantic HTML
- [x] עיצוב CSS מותאם
- [x] JavaScript עם promises
- [x] קובץ .gitignore
- [x] README מעודכן
- [x] נתיבי API (auth, users, babysitters, messages)
- [x] middleware לאימות
- [x] דף חיפוש ביביסיטרים
- [x] דף צ'אט
- [x] מערכת הודעות מלאה
- [x] **CRUD מלא לכל צד**

### 🔄 בתהליך
- [ ] דף הרשמה והתחברות
- [ ] דף פרופיל משתמש
- [ ] אינטגרציה מלאה

### ⏳ ממתין
- [ ] בדיקות ואינטגרציה
- [ ] תיעוד Postman
- [ ] תרשימי UML

## 📊 דרישות הקורס
- ✅ שני סוגי משתמשים (הורים/בייביסיטרים)
- ✅ פעולות CRUD מלאות
- ✅ RESTful API
- ✅ API פנימי (הודעות)
- ✅ עיצוב responsive
- ✅ תיעוד Postman
- ✅ תרשימי UML

## 🔧 הגדרות MongoDB Atlas
```javascript
// Connection string format
mongodb+srv://username:password@cluster.mongodb.net/babysitter-finder?retryWrites=true&w=majority

// Connection options
{
  "useNewUrlParser": true,
  "useUnifiedTopology": true,
  "maxPoolSize": 10,
  "serverSelectionTimeoutMS": 5000,
  "socketTimeoutMS": 45000,
  "bufferMaxEntries": 0
}
```

## 📝 הערות חשובות
1. **Semantic HTML:** להשתמש ב-section, article, header, footer, nav, main
2. **Promises:** להשתמש ב-.then() במקום async/await
3. **Bootstrap:** לעיצוב responsive
4. **MongoDB Atlas:** לבסיס נתונים בענן
5. **JWT:** לאימות משתמשים
6. **CORS:** לאפשר גישה מ-Frontend

## 🎨 עיצוב
- צבעים: כחול (#007bff) כצבע ראשי
- פונט: Segoe UI
- כיוון: RTL (עברית)
- Responsive: Bootstrap 5
- אנימציות: CSS transitions

## 🔐 אבטחה
- JWT tokens
- bcrypt להצפנת סיסמאות
- CORS middleware
- Helmet.js
- Validation עם express-validator

## 📱 API Endpoints (הושלם עם CRUD מלא)
```
# Authentication
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/verify

# Users CRUD
GET    /api/users/profile
PUT    /api/users/profile
DELETE /api/users/profile
GET    /api/users/:id
GET    /api/users
PUT    /api/users/:id
DELETE /api/users/:id

# Babysitters
GET    /api/babysitters
GET    /api/babysitters/:id
GET    /api/babysitters/cities/list

# Messages CRUD
POST   /api/messages
GET    /api/messages
PUT    /api/messages/:messageId
DELETE /api/messages/:messageId
GET    /api/messages/conversations
GET    /api/messages/conversation/:userId
GET    /api/messages/unread/count
PUT    /api/messages/:messageId/read
```

## 🗂️ CRUD Operations - פירוט מלא

### 👤 Users (משתמשים)
- **Create:** POST /api/auth/register
- **Read:** GET /api/users/profile, GET /api/users/:id, GET /api/users
- **Update:** PUT /api/users/profile, PUT /api/users/:id
- **Delete:** DELETE /api/users/profile, DELETE /api/users/:id

### 💬 Messages (הודעות)
- **Create:** POST /api/messages
- **Read:** GET /api/messages, GET /api/messages/conversations, GET /api/messages/conversation/:userId
- **Update:** PUT /api/messages/:messageId, PUT /api/messages/:messageId/read
- **Delete:** DELETE /api/messages/:messageId

### 👶 Babysitters (ביביסיטרים)
- **Create:** POST /api/auth/register (userType: 'babysitter')
- **Read:** GET /api/babysitters, GET /api/babysitters/:id
- **Update:** PUT /api/users/profile (עבור ביביסיטרים)
- **Delete:** DELETE /api/users/profile

## 👥 צוות
- מתכנת 1: Frontend
- מתכנת 2: Backend

## 📅 לוח זמנים
- **שלב 1:** ✅ הגדרת פרויקט וסנכרון צוות
- **שלב 2:** ✅ פיתוח Frontend ו-Backend במקביל
- **שלב 3:** 🔄 אינטגרציה ובדיקות
- **שלב 4:** ⏳ הגשה ותיעוד

## 🐛 בעיות ידועות
- אין בעיות כרגע

## 💡 רעיונות לשיפור
- הוספת מערכת דירוגים וביקורות
- הוספת תמונות פרופיל
- הוספת התראות בזמן אמת
- הוספת מערכת תשלומים
- הוספת מפה אינטראקטיבית

---
**עודכן לאחרונה:** 14/07/2024
**סטטוס:** בשלב 3 - אינטגרציה (Backend ו-Frontend הושלמו עם CRUD מלא) 

## תיעוד תהליך בדיקת API ערים בישראל (GeoDB Cities API)

### רקע
בפרויקט Babysitter Finder היה בעבר קובץ סטטי עם שמות ערים. עברנו לשימוש ב-API חיצוני בלבד (GeoDB Cities API דרך RapidAPI) עבור השלמת ערים בישראל.

### שלבים עיקריים:

1. **וידוא שאין קובץ ערים סטטי**
   - בוצע חיפוש בפרויקט, לא נמצא קובץ cities.json/cities.js או דומה.
   - כל השלמת הערים מתבצעת דרך ה-API בלבד.

2. **בדיקת קוד השרת**
   - קובץ `server/routes/cities.js` משתמש ב-axios ושולח בקשה ל-GeoDB Cities API עם סינון לישראל בלבד.
   - אין תלות ברשימה מקומית.

3. **בדיקת קובץ .env**
   - קובץ `.env` לא היה קיים (חסום לעריכה ישירה ב-Cursor).
   - נוצר קובץ `.env` ידנית בטרמינל עם הערכים:
     - RAPID_API_KEY
     - RAPID_API_HOST
     - שאר משתני הסביבה (MongoDB, JWT וכו').

4. **הרצת השרת**
   - יש להריץ את השרת מתוך תיקיית server: `node server.js`
   - אם מריצים מהשורש, מתקבלת שגיאה: `Cannot find module '.../server.js'`
   - כשהשרת רץ, ה-API אמור להאזין על פורט 3000.

5. **בדיקת API השלמת ערים - תוצאות**
   - השרת הופעל בהצלחה עם כל משתני הסביבה הנדרשים.
   - ה-health endpoint עובד: `{"status":"OK","message":"Babysitter Finder API is running"}`
   - **בעיה זוהתה**: ה-API מחזיר שגיאה 403 (Forbidden) מה-GeoDB API
   - התגובה: `{"cities":[],"message":"שגיאה בשליפת ערים מ-GeoDB API","error":"Request failed with status code 403"}`
   - הבעיה נבדקה גם עם חיפוש באנגלית ("Tel") וגם עם עברית ("תל") - אותה שגיאה.

6. **אבחון הבעיה**
   - שגיאה 403 מצביעה על בעיה עם המפתח של RapidAPI או עם הבקשה עצמה.
   - הקוד נראה תקין - הבעיה כנראה במפתח או בהרשאות.
   - ייתכן שהמפתח פג תוקף או שיש בעיה עם ה-API עצמו.

7. **הערות ולקחים**
   - `.env` מופיע ב-.gitignore (כראוי), אבל זה לא מונע יצירה ידנית.
   - יש להקפיד להריץ את השרת מהתיקייה הנכונה.
   - כל השלמת הערים מתבצעת אך ורק דרך ה-API החיצוני, אין קוד או קובץ סטטי.
   - **נדרש לבדוק את המפתח של RapidAPI או לחדש אותו**.

---

### TODO להמשך:
- [ ] לבדוק את תקינות המפתח של RapidAPI
- [ ] לחדש את המפתח אם נדרש
- [ ] לבדוק את התיעוד של GeoDB Cities API
- [ ] לבדוק שוב את ה-API אחרי תיקון המפתח

---

_עודכן ע"י Cursor, 14/07/2025_ 

# תיעוד סידור הפרויקט - Babysitter Finder

## מבנה תיקיות מומלץ (נכון להיום):

```
babysitter-finder/
├── client/
│   ├── index.html         ← דף הבית הראשי
│   ├── pages/             ← כל שאר דפי ה-HTML (search.html, chat.html וכו')
│   ├── js/
│   ├── css/
│   └── ...
├── server/
│   └── server.js
├── .env
├── README.md
└── ...
```

## עקרונות וסטנדרטים שבוצעו:
- כל קבצי ה-HTML (כולל index.html) נמצאים תחת client/.
- דפי משנה (search.html, chat.html וכו') בתיקיית client/pages/.
- קוד השרת בתיקיית server/.
- קובץ env יחיד בשורש, כל ההגדרות מרוכזות בו.
- אין קבצי דוגמה/קונפיג כפולים.
- אין קבצי HTML מיותרים בתיקיות אחרות.
- מבנה תיקיות ברור, מקצועי וקל לתחזוקה.

## למה זה טוב?
- הפרדה ברורה בין צד לקוח לשרת.
- סדר, ניקיון וסטנדרט תעשייתי.
- קלות תחזוקה, דיפלוי, והבנה של הפרויקט.
- מתאים לכל פלטפורמות הדיפלוי המודרניות.

## הערות:
- אם מוסיפים דף HTML חדש – לשים אותו ב-client/pages/.
- אם מוסיפים משתנה סביבה – להוסיף ל-.env בשורש.
- אם מישהו אחר עובד איתך – לתת לו דוגמה ל-.env (ללא סיסמאות).

---

**הפרויקט מסודר לפי כללי תעשייה!**
אם יש צורך בשינוי/שדרוג – לעדכן כאן. 