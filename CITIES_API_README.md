# Cities API - מדריך לשימוש ב-API ערים

## סקירה כללית
ה-API הזה מספק חיפוש ערים בעברית באמצעות נתוני הממשלה (data.gov.il).

## נתיב ה-API
```
GET /api/cities?q=<query>
```

## דוגמאות שימוש

### 1. חיפוש ערים שמתחילות ב"תל"
```bash
curl "http://localhost:3000/api/cities?q=%D7%AA%D7%9C"
```

### 2. חיפוש ערים שמתחילות ב"ירוש"
```bash
curl "http://localhost:3000/api/cities?q=%D7%99%D7%A8%D7%95%D7%A9"
```

## ⚠️ חשוב מאוד: קידוד תווים עבריים

### בצד הלקוח (Frontend)
**תמיד** השתמש ב-`encodeURIComponent()` לפני שליחת הבקשה:

```javascript
// ✅ נכון
const query = 'תל';
const encodedQuery = encodeURIComponent(query);
fetch(`/api/cities?q=${encodedQuery}`);

// ❌ שגוי - עלול לגרום לשגיאות
fetch(`/api/cities?q=${query}`);
```

### דוגמה מלאה בצד הלקוח
```javascript
function searchCities(query) {
    const encodedQuery = encodeURIComponent(query);
    
    return fetch(`/api/cities?q=${encodedQuery}`)
        .then(response => response.json())
        .then(data => {
            return data.cities || [];
        })
        .catch(error => {
            console.error('Error fetching cities:', error);
            return [];
        });
}
```

## בדיקת תקינות

### 1. בדיקת השרת
```bash
# בדוק שהשרת רץ
curl http://localhost:3000/api/health

# בדוק חיפוש ערים
curl "http://localhost:3000/api/cities?q=%D7%AA%D7%9C"
```

### 2. בדיקת תגובה תקינה
תגובה תקינה צריכה להיראות כך:
```json
{
  "cities": [
    "תל אביב - יפו ",
    "גליל ים ",
    "מחנה תל נוף ",
    "ניר דוד (תל עמל) ",
    "תל שבע "
  ]
}
```

## פתרון בעיות

### בעיה: 400 Bad Request
**סיבה:** תווים עבריים לא מקודדים כראוי
**פתרון:** וודא שאתה משתמש ב-`encodeURIComponent()`

### בעיה: תגובה ריקה
**סיבה:** השרת לא מקבל את הבקשה כראוי
**פתרון:** בדוק את הלוגים של השרת

### בעיה: שגיאת חיבור
**סיבה:** השרת לא רץ
**פתרון:** הפעל את השרת מחדש
```bash
cd server && node server.js
```

## מבנה הנתונים

### תגובת ה-API
```typescript
interface CitiesResponse {
  cities: string[];  // רשימת שמות ערים בעברית
}
```

### פרמטרים
- `q` (required): מחרוזת חיפוש (חייבת להיות מקודדת)

## הגבלות
- מקסימום 20 תוצאות לכל בקשה
- חיפוש מתבצע רק בשמות ערים בעברית
- נדרש חיבור לאינטרנט לגישה ל-data.gov.il

## עדכונים אחרונים
- ✅ תוקן נתיב ה-API מ-`/cities/search` ל-`/cities`
- ✅ הוספת `encodeURIComponent()` בקוד הלקוח
- ✅ בדיקת תקינות עם תווים עבריים

## הערות חשובות
1. **תמיד** השתמש ב-`encodeURIComponent()` עבור תווים עבריים
2. השרת מטפל בקידוד אוטומטית באמצעות axios
3. התגובה תמיד תהיה בעברית
4. אם יש בעיות, בדוק את הלוגים של השרת

---
*עודכן לאחרונה: 15.7.2025* 