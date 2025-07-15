// helpers.js - פונקציות עזר לשרת
// פרויקט סיום קורס ווב ענן - Babysitter Finder

console.log('טוען קובץ פונקציות עזר...');

// פונקציה לבדיקת תקינות אימייל
function isValidEmail(email) {
    console.log('בודק תקינות אימייל:', email);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    console.log('תקינות האימייל:', isValid);
    return isValid;
}

// פונקציה לבדיקת תקינות סיסמה
function isValidPassword(password) {
    console.log('בודק תקינות סיסמה...');
    
    // בדיקה בסיסית - לפחות 6 תווים
    if (password.length < 6) {
        console.log('הסיסמה קצרה מדי');
        return false;
    }
    
    // בדיקה שיש לפחות אות אחת גדולה
    if (!/[A-Z]/.test(password)) {
        console.log('הסיסמה צריכה להכיל אות גדולה');
        return false;
    }
    
    // בדיקה שיש לפחות מספר אחד
    if (!/\d/.test(password)) {
        console.log('הסיסמה צריכה להכיל מספר');
        return false;
    }
    
    console.log('הסיסמה תקינה');
    return true;
}

// פונקציה לבדיקת תקינות מספר טלפון
function isValidPhone(phone) {
    console.log('בודק תקינות מספר טלפון:', phone);
    
    // הסרת רווחים וסימנים
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // בדיקה שמתחיל ב-05 או 972
    const isValid = /^(05|9725)\d{8}$/.test(cleanPhone);
    
    console.log('תקינות מספר הטלפון:', isValid);
    return isValid;
}

// פונקציה לניקוי נתונים
function sanitizeData(data) {
    console.log('מנקה נתונים...');
    
    const cleaned = {};
    for (const key in data) {
        if (typeof data[key] === 'string') {
            // הסרת תווים מסוכנים
            cleaned[key] = data[key]
                .trim()
                .replace(/[<>]/g, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+=/gi, '');
        } else {
            cleaned[key] = data[key];
        }
    }
    
    console.log('הנתונים נוקו');
    return cleaned;
}

// פונקציה ליצירת תאריך עברי
function getHebrewDate(date = new Date()) {
    console.log('יוצר תאריך עברי...');
    
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    
    const hebrewDate = date.toLocaleDateString('he-IL', options);
    console.log('תאריך עברי:', hebrewDate);
    return hebrewDate;
}

// פונקציה לחישוב גיל
function calculateAge(birthDate) {
    console.log('מחשב גיל...');
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    
    // בדיקה אם עוד לא הגיע יום ההולדת השנה
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    console.log('הגיל המחושב:', age);
    return age;
}

// פונקציה ליצירת קוד אקראי
function generateRandomCode(length = 6) {
    console.log('יוצר קוד אקראי באורך:', length);
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    console.log('הקוד שנוצר:', code);
    return code;
}

// פונקציה לבדיקת תקינות תאריך
function isValidDate(dateString) {
    console.log('בודק תקינות תאריך:', dateString);
    
    const date = new Date(dateString);
    const isValid = date instanceof Date && !isNaN(date);
    
    console.log('תקינות התאריך:', isValid);
    return isValid;
}

// פונקציה לבדיקה אם תאריך הוא בעתיד
function isFutureDate(dateString) {
    console.log('בודק אם התאריך בעתיד:', dateString);
    
    const date = new Date(dateString);
    const today = new Date();
    const isFuture = date > today;
    
    console.log('התאריך בעתיד:', isFuture);
    return isFuture;
}

// פונקציה לבדיקת תקינות שעה
function isValidTime(timeString) {
    console.log('בודק תקינות שעה:', timeString);
    
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const isValid = timeRegex.test(timeString);
    
    console.log('תקינות השעה:', isValid);
    return isValid;
}

// פונקציה להמרת שעה לפורמט 12 שעות
function formatTime12Hour(timeString) {
    console.log('ממיר שעה לפורמט 12 שעות:', timeString);
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    const formattedTime = `${hour12}:${minutes} ${ampm}`;
    console.log('השעה בפורמט 12 שעות:', formattedTime);
    return formattedTime;
}

// פונקציה לבדיקת תקינות שם
function isValidName(name) {
    console.log('בודק תקינות שם:', name);
    
    // בדיקה שהשם מכיל רק אותיות ורווחים
    const nameRegex = /^[א-ת\s]+$/;
    const isValid = nameRegex.test(name) && name.length >= 2;
    
    console.log('תקינות השם:', isValid);
    return isValid;
}

// פונקציה לבדיקת תקינות עיר
function isValidCity(city) {
    console.log('בודק תקינות עיר:', city);
    
    // רשימת ערים בישראל (חלקית)
    const israeliCities = [
        'תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'אשדוד', 'נתניה', 'ראשון לציון',
        'פתח תקווה', 'אשקלון', 'רחובות', 'הרצליה', 'כפר סבא', 'בית שמש',
        'מודיעין עילית', 'לוד', 'רמת גן', 'רעננה', 'נצרת', 'אום אל-פחם',
        'עכו', 'אלעד', 'בית שאן', 'קריית גת', 'אריאל', 'רמלה', 'נהריה'
    ];
    
    const isValid = israeliCities.includes(city);
    console.log('תקינות העיר:', isValid);
    return isValid;
}

// פונקציה לבדיקת תקינות מחיר
function isValidPrice(price) {
    console.log('בודק תקינות מחיר:', price);
    
    const numPrice = parseFloat(price);
    const isValid = !isNaN(numPrice) && numPrice > 0 && numPrice <= 1000;
    
    console.log('תקינות המחיר:', isValid);
    return isValid;
}

// פונקציה לבדיקת תקינות תיאור
function isValidDescription(description) {
    console.log('בודק תקינות תיאור...');
    
    const isValid = description && description.length >= 10 && description.length <= 500;
    
    console.log('תקינות התיאור:', isValid);
    return isValid;
}

// פונקציה ליצירת תקציר טקסט
function createSummary(text, maxLength = 100) {
    console.log('יוצר תקציר טקסט...');
    
    if (text.length <= maxLength) {
        return text;
    }
    
    const summary = text.substring(0, maxLength) + '...';
    console.log('התקציר שנוצר:', summary);
    return summary;
}

// פונקציה לבדיקת תקינות גיל
function isValidAge(age) {
    console.log('בודק תקינות גיל:', age);
    
    const numAge = parseInt(age);
    const isValid = !isNaN(numAge) && numAge >= 16 && numAge <= 100;
    
    console.log('תקינות הגיל:', isValid);
    return isValid;
}

// פונקציה לבדיקת תקינות ניסיון
function isValidExperience(experience) {
    console.log('בודק תקינות ניסיון:', experience);
    
    const validExperiences = ['beginner', 'intermediate', 'expert'];
    const isValid = validExperiences.includes(experience);
    
    console.log('תקינות הניסיון:', isValid);
    return isValid;
}

// פונקציה להמרת ניסיון לטקסט עברי
function getExperienceText(experience) {
    console.log('ממיר ניסיון לטקסט עברי:', experience);
    
    const experienceMap = {
        'beginner': 'מתחיל',
        'intermediate': 'בינוני',
        'expert': 'מומחה'
    };
    
    const text = experienceMap[experience] || 'לא צוין';
    console.log('הטקסט בעברית:', text);
    return text;
}

// פונקציה לבדיקת תקינות זמינות
function isValidAvailability(availability) {
    console.log('בודק תקינות זמינות...');
    
    if (!Array.isArray(availability)) {
        console.log('הזמינות אינה מערך');
        return false;
    }
    
    const validDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const isValid = availability.every(day => validDays.includes(day));
    
    console.log('תקינות הזמינות:', isValid);
    return isValid;
}

// פונקציה לבדיקת תקינות שעות עבודה
function isValidWorkingHours(hours) {
    console.log('בודק תקינות שעות עבודה:', hours);
    
    if (!hours || typeof hours !== 'object') {
        console.log('שעות העבודה לא תקינות');
        return false;
    }
    
    const { start, end } = hours;
    const isValid = isValidTime(start) && isValidTime(end) && start < end;
    
    console.log('תקינות שעות העבודה:', isValid);
    return isValid;
}

// פונקציה לבדיקת תקינות דירוג
function isValidRating(rating) {
    console.log('בודק תקינות דירוג:', rating);
    
    const numRating = parseFloat(rating);
    const isValid = !isNaN(numRating) && numRating >= 1 && numRating <= 5;
    
    console.log('תקינות הדירוג:', isValid);
    return isValid;
}

// פונקציה ליצירת כוכבי דירוג
function createRatingStars(rating) {
    console.log('יוצר כוכבי דירוג:', rating);
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // כוכבים מלאים
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="bi bi-star-fill text-warning"></i>';
    }
    
    // כוכב חצי
    if (hasHalfStar) {
        stars += '<i class="bi bi-star-half text-warning"></i>';
    }
    
    // כוכבים ריקים
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="bi bi-star text-warning"></i>';
    }
    
    console.log('כוכבי הדירוג שנוצרו');
    return stars;
}

// פונקציה לבדיקת תקינות הודעה
function isValidMessage(message) {
    console.log('בודק תקינות הודעה...');
    
    const isValid = message && message.trim().length > 0 && message.length <= 1000;
    
    console.log('תקינות ההודעה:', isValid);
    return isValid;
}

// פונקציה לבדיקת תקינות ID
function isValidId(id) {
    console.log('בודק תקינות ID:', id);
    
    // בדיקה שזה ObjectId של MongoDB
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    const isValid = objectIdRegex.test(id);
    
    console.log('תקינות ה-ID:', isValid);
    return isValid;
}

// פונקציה ליצירת תאריך קריא
function formatReadableDate(date) {
    console.log('יוצר תאריך קריא:', date);
    
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const readableDate = new Date(date).toLocaleDateString('he-IL', options);
    console.log('התאריך הקריא:', readableDate);
    return readableDate;
}

// פונקציה לבדיקת תקינות קובץ
function isValidFile(file) {
    console.log('בודק תקינות קובץ...');
    
    if (!file) {
        console.log('אין קובץ');
        return false;
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    const isValidType = validTypes.includes(file.mimetype);
    const isValidSize = file.size <= maxSize;
    
    console.log('תקינות הקובץ:', isValidType && isValidSize);
    return isValidType && isValidSize;
}

console.log('קובץ פונקציות העזר הוכן בהצלחה!');

// ייצוא הפונקציות
module.exports = {
    isValidEmail,
    isValidPassword,
    isValidPhone,
    sanitizeData,
    getHebrewDate,
    calculateAge,
    generateRandomCode,
    isValidDate,
    isFutureDate,
    isValidTime,
    formatTime12Hour,
    isValidName,
    isValidCity,
    isValidPrice,
    isValidDescription,
    createSummary,
    isValidAge,
    isValidExperience,
    getExperienceText,
    isValidAvailability,
    isValidWorkingHours,
    isValidRating,
    createRatingStars,
    isValidMessage,
    isValidId,
    formatReadableDate,
    isValidFile
}; 