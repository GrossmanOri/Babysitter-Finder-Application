# Babysitter Finder - מציאת בייביסיטר

## תיאור הפרויקט 📝

זהו פרויקט סיום לקורס ווב ענן - אפליקציה למציאת בייביסיטרים בישראל.
האפליקציה מאפשרת להורים למצוא בייביסיטרים זמינים ולקיים איתם תקשורת.

## תכונות עיקריות ✨

- 🔍 **חיפוש בייביסיטרים** - לפי עיר, תאריך ושעה
- 💬 **מערכת הודעות** - צ'אט בין הורים לבייביסיטרים
- 👤 **ניהול פרופילים** - לכל משתמש יש פרופיל מפורט
- ⭐ **דירוגים וביקורות** - מערכת דירוג לבייביסיטרים
- 📱 **עיצוב רספונסיבי** - עובד על כל המכשירים

## טכנולוגיות ששימשו 🛠️

### Frontend (Client):
- HTML5 (Semantic - ללא divs!)
- CSS3 + Bootstrap 5
- JavaScript (ES6+ עם Promises)
- Fetch API

### Backend (Server):
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

## התקנה והפעלה 🚀

### דרישות מקדימות:
- Node.js (גרסה 14 ומעלה)
- MongoDB (מקומי או Atlas)
- npm או yarn

### שלבי התקנה:

1. **שכפול הפרויקט:**
```bash
git clone [URL-של-הפרויקט]
cd babysitter-finder
```

2. **התקנת תלויות השרת:**
```bash
cd server
npm install
```

3. **הגדרת משתני סביבה:**
צור קובץ `.env` בתיקיית `server`:
```env
MONGODB_URI=mongodb://localhost:27017/babysitter-finder
JWT_SECRET=your-secret-key-here
PORT=3000
```

4. **הפעלת השרת:**
```bash
npm start
# או
node server.js
```

5. **הפעלת הלקוח:**
```bash
cd ../client
python3 -m http.server 8080
# או כל שרת HTTP אחר
```

## מבנה הפרויקט 📁

```
babysitter-finder/
├── client/                 # Frontend
│   ├── index.html         # דף הבית
│   ├── pages/             # דפים נוספים
│   │   ├── search.html    # דף חיפוש
│   │   └── chat.html      # דף צ'אט
│   ├── js/                # קבצי JavaScript
│   │   ├── pages/         # קוד לדפים ספציפיים
│   │   └── components/    # רכיבים משותפים
│   └── css/              # קבצי עיצוב
└── server/               # Backend
    ├── server.js         # קובץ השרת הראשי
    ├── models/           # מודלים של מסד הנתונים
    ├── routes/           # נתיבי API
    ├── middleware/       # תוכנה ביניים
    └── package.json      # תלויות
```

## API Endpoints 📡

### אימות (Authentication):
- `POST /api/auth/register` - הרשמת משתמש חדש
- `POST /api/auth/login` - התחברות
- `GET /api/auth/profile` - קבלת פרופיל המשתמש

### בייביסיטרים:
- `GET /api/babysitters` - רשימת בייביסיטרים
- `GET /api/babysitters/:id` - פרטי בייביסיטר ספציפי
- `POST /api/babysitters` - הוספת בייביסיטר חדש
- `PUT /api/babysitters/:id` - עדכון בייביסיטר

### הודעות:
- `GET /api/messages` - קבלת הודעות
- `POST /api/messages` - שליחת הודעה חדשה
- `PUT /api/messages/:id` - עדכון הודעה
- `DELETE /api/messages/:id` - מחיקת הודעה

## דוגמאות שימוש 💡

### חיפוש בייביסיטרים:
```javascript
fetch('/api/babysitters?city=תל אביב&date=2024-01-15')
  .then(response => response.json())
  .then(data => console.log(data));
```

### שליחת הודעה:
```javascript
fetch('/api/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    recipientId: 'user-id',
    content: 'שלום, האם אתה זמין?'
  })
});
```

## בעיות ידועות ⚠️

- לפעמים יש בעיות בחיבור למסד הנתונים
- הצ'אט לא עובד בזמן אמת (רק רענון דף)
- אין אימות תמונות בייביסיטרים

## תוכניות עתידיות 🔮

- [ ] הוספת צ'אט בזמן אמת עם WebSockets
- [ ] מערכת הזמנות עם לוח שנה
- [ ] תשלומים אונליין
- [ ] אפליקציה למובייל
- [ ] מערכת דירוגים מתקדמת

## תרומה לפרויקט 🤝

אם תרצו לתרום לפרויקט:
1. Fork את הפרויקט
2. צרו branch חדש
3. בצעו את השינויים
4. שלחו Pull Request

## רישיון 📄

פרויקט זה נוצר עבור קורס ווב ענן - כל הזכויות שמורות.

## פרטי קשר 📞

- **שם:** [שם הסטודנט]
- **אימייל:** [email@example.com]
- **קורס:** ווב ענן - שנה ב'

---

**הערה:** זהו פרויקט לימודים ולא מוצר מסחרי. השתמשו בו על אחריותכם בלבד! 😊 