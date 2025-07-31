# Babysitter Finder - פרויקט סיום ווב ענן

## תיאור הפרויקט

פרויקט זה הינו פרויקט סיום לקורס "ווב ענן" שנה ב'. האפליקציה מאפשרת להורים למצוא בייביסיטרים זמינים באזורם ולקיים איתם תקשורת ישירה.

### מטרות הפרויקט
- פיתוח אפליקציה מלאה עם Frontend ו-Backend
- שימוש בטכנולוגיות מודרניות לפיתוח web
- יישום עקרונות אבטחה בסיסיים
- יצירת ממשק משתמש ידידותי ונגיש

## תכונות הפרויקט

### תכונות עיקריות
- **הרשמה והתחברות** - מערכת משתמשים עם אימות JWT
- **חיפוש בייביסיטרים** - לפי עיר ופרמטרים נוספים
- **מערכת הודעות** - צ'אט בין הורים לבייביסיטרים
- **ניהול פרופילים** - עדכון פרטי משתמש
- **עיצוב רספונסיבי** - תמיכה במכשירים שונים

### תכונות טכניות
- **אימות משתמשים** - עם JWT tokens
- **אחסון נתונים** - MongoDB Atlas
- **API RESTful** - עם Express.js
- **Frontend דינמי** - עם JavaScript ו-Bootstrap

## טכנולוגיות ששימשו

### Frontend
- **HTML5** - מבנה סמנטי נכון
- **CSS3** - עיצוב מודרני עם Bootstrap 5
- **JavaScript ES6+** - לוגיקה דינמית
- **Fetch API** - תקשורת עם השרת

### Backend
- **Node.js** - סביבת ריצה
- **Express.js** - framework לשרת
- **MongoDB** - מסד נתונים NoSQL
- **Mongoose** - ODM למסד הנתונים
- **JWT** - אימות משתמשים
- **bcryptjs** - הצפנת סיסמאות

## התקנה והפעלה

### דרישות מערכת
- Node.js (גרסה 14 ומעלה)
- npm או yarn
- חיבור לאינטרנט (עבור MongoDB Atlas)

### שלבי התקנה

1. **שכפול הפרויקט**
```bash
git clone [repository-url]
cd babysitter-finder
```

2. **התקנת תלויות**
```bash
cd server
npm install
```

3. **הגדרת משתני סביבה**
צור קובץ `.env` בתיקיית `server`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=development
```

4. **הפעלת השרת**
```bash
npm start
```

5. **הפעלת הלקוח**
```bash
cd ../client
npm start
```

### URLs לאחר הפעלה
- **Client (Frontend):** http://localhost:3001 או http://127.0.0.1:3001
- **Server (Backend):** http://localhost:3000
- **API Base URL:** http://localhost:3000/api

## מבנה הפרויקט

```
babysitter-finder/
├── client/                 # Frontend
│   ├── index.html         # דף הבית עם הרשמה/התחברות
│   ├── pages/             # דפים נוספים
│   │   ├── search.html    # חיפוש בייביסיטרים
│   │   ├── chat.html      # צ'אט ישיר
│   │   ├── conversations.html  # רשימת שיחות
│   │   ├── profile.html   # ניהול פרופיל
│   │   └── about.html     # דף אודות
│   ├── js/                # קבצי JavaScript
│   │   ├── main.js        # קוד ראשי
│   │   ├── pages/         # קוד לדפים ספציפיים
│   │   └── utils/         # פונקציות עזר
│   └── css/               # קבצי עיצוב
└── server/                # Backend
    ├── server.js          # קובץ השרת הראשי
    ├── config/            # הגדרות
    ├── models/            # מודלים של מסד הנתונים
    ├── routes/            # נתיבי API
    ├── middleware/        # תוכנה ביניים
    ├── utils/             # פונקציות עזר
    └── data/              # קבצי נתונים
```

## API Documentation

### Authentication
- `POST /api/auth/register` - הרשמת משתמש חדש
- `POST /api/auth/login` - התחברות משתמש
- `GET /api/auth/profile` - קבלת פרטי משתמש

### Users
- `GET /api/users/profile` - קבלת פרופיל
- `PUT /api/users/profile` - עדכון פרופיל
- `DELETE /api/users/profile` - מחיקת חשבון

### Babysitters
- `GET /api/babysitters` - רשימת בייביסיטרים
- `GET /api/babysitters/search` - חיפוש בייביסיטרים

### Messages
- `GET /api/messages/conversations` - רשימת שיחות
- `GET /api/messages/:conversationId` - הודעות בשיחה
- `POST /api/messages` - שליחת הודעה
- `DELETE /api/messages/conversations/:id` - מחיקת שיחה

## דוגמאות קוד

### הרשמת משתמש
```javascript
const userData = {
  firstName: 'ישראל',
  lastName: 'כהן',
  email: 'israel@example.com',
  password: 'password123',
  phone: '050-1234567',
  city: 'תל אביב',
  userType: 'parent'
};

fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
});
```

### חיפוש בייביסיטרים
```javascript
fetch('/api/babysitters?city=תל אביב')
  .then(response => response.json())
  .then(babysitters => {
    console.log('נמצאו בייביסיטרים:', babysitters);
  });
```

## אתגרים ופתרונות

### אתגרים עיקריים
1. **ניהול מצב משתמש** - פתרון עם JWT tokens
2. **תקשורת בזמן אמת** - פתרון עם polling
3. **עיצוב רספונסיבי** - פתרון עם Bootstrap 5
4. **אבטחה** - הצפנת סיסמאות עם bcrypt

### למידה מהפרויקט
- הבנת ארכיטקטורת Client-Server
- עבודה עם מסדי נתונים NoSQL
- פיתוח API RESTful
- ניהול מצב משתמש
- עיצוב ממשק משתמש

## מסקנות

פרויקט זה הדגים את היכולת לפתח אפליקציה מלאה עם:
- **Frontend** - ממשק משתמש אינטואיטיבי
- **Backend** - שרת API מאובטח
- **Database** - אחסון נתונים יעיל
- **Security** - אימות והרשאות

הפרויקט מספק בסיס טוב להמשך פיתוח ויכול להתרחב לתכונות נוספות כמו תשלומים, לוח זמנים, ודירוגים.

## פרטי סטודנט

- **שם:** אורי גרוסמן ועמית אליה
- **קורס:** ווב ענן - שנה ב'
- **מוסד:** שנקר - הנדסת תוכנה
- **שנה:** 2025

---

*פרויקט זה הינו חלק מדרישות הקורס "ווב ענן" ואינו מיועד לשימוש מסחרי.* 
