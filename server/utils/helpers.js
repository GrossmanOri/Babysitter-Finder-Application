console.log('Loading helper functions file...');
function isValidEmail(email) {
    console.log('Checking email validity:', email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    console.log('Email validity:', isValid);
    return isValid;
}
function isValidPassword(password) {
    console.log('Checking password validity...');
    if (password.length < 6) {
        console.log('Password is too short');
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        console.log('Password needs to contain uppercase letter');
        return false;
    }
    if (!/\d/.test(password)) {
        console.log('Password needs to contain a number');
        return false;
    }
    console.log('Password is valid');
    return true;
}
function isValidPhone(phone) {
    console.log('Checking phone number validity:', phone);
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const isValid = /^(05|9725)\d{8}$/.test(cleanPhone);
    console.log('Phone number validity:', isValid);
    return isValid;
}
function sanitizeData(data) {
    console.log('Sanitizing data...');
    const cleaned = {};
    for (const key in data) {
        if (typeof data[key] === 'string') {
            cleaned[key] = data[key]
                .trim()
                .replace(/[<>]/g, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+=/gi, '');
        } else {
            cleaned[key] = data[key];
        }
    }
    console.log('Data sanitized');
    return cleaned;
}
function getHebrewDate(date = new Date()) {
    console.log('Creating Hebrew date...');
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    const hebrewDate = date.toLocaleDateString('he-IL', options);
    console.log('Hebrew date:', hebrewDate);
    return hebrewDate;
}
function calculateAge(birthDate) {
    console.log('Calculating age...');
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    console.log('Calculated age:', age);
    return age;
}
function generateRandomCode(length = 6) {
    console.log('Generating random code with length:', length);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    console.log('Generated code:', code);
    return code;
}
function isValidDate(dateString) {
    console.log('Checking date validity:', dateString);
    const date = new Date(dateString);
    const isValid = date instanceof Date && !isNaN(date);
    console.log('Date validity:', isValid);
    return isValid;
}
function isFutureDate(dateString) {
    console.log('Checking if date is in the future:', dateString);
    const date = new Date(dateString);
    const today = new Date();
    const isFuture = date > today;
    console.log('Date is in the future:', isFuture);
    return isFuture;
}
function isValidTime(timeString) {
    console.log('Checking time validity:', timeString);
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const isValid = timeRegex.test(timeString);
    console.log('Time validity:', isValid);
    return isValid;
}
function formatTime12Hour(timeString) {
    console.log('Converting time to 12-hour format:', timeString);
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const formattedTime = `${hour12}:${minutes} ${ampm}`;
    console.log('Time in 12-hour format:', formattedTime);
    return formattedTime;
}
function isValidName(name) {
    console.log('Checking name validity:', name);
    const nameRegex = /^[א-ת\s]+$/;
    const isValid = nameRegex.test(name) && name.length >= 2;
    console.log('Name validity:', isValid);
    return isValid;
}
function isValidCity(city) {
    console.log('Checking city validity:', city);
    const israeliCities = [
        'תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'אשדוד', 'נתניה', 'ראשון לציון',
        'פתח תקווה', 'אשקלון', 'רחובות', 'הרצליה', 'כפר סבא', 'בית שמש',
        'מודיעין עילית', 'לוד', 'רמת גן', 'רעננה', 'נצרת', 'אום אל-פחם',
        'עכו', 'אלעד', 'בית שאן', 'קריית גת', 'אריאל', 'רמלה', 'נהריה'
    ];
    const isValid = israeliCities.includes(city);
    console.log('City validity:', isValid);
    return isValid;
}
function isValidPrice(price) {
    console.log('Checking price validity:', price);
    const numPrice = parseFloat(price);
    const isValid = !isNaN(numPrice) && numPrice > 0 && numPrice <= 1000;
    console.log('Price validity:', isValid);
    return isValid;
}
function isValidDescription(description) {
    console.log('Checking description validity...');
    const isValid = description && description.length >= 10 && description.length <= 500;
    console.log('Description validity:', isValid);
    return isValid;
}
function createSummary(text, maxLength = 100) {
    console.log('Creating text summary...');
    if (text.length <= maxLength) {
        return text;
    }
    const summary = text.substring(0, maxLength) + '...';
    console.log('Generated summary:', summary);
    return summary;
}
function isValidAge(age) {
    console.log('Checking age validity:', age);
    const numAge = parseInt(age);
    const isValid = !isNaN(numAge) && numAge >= 16 && numAge <= 100;
    console.log('Age validity:', isValid);
    return isValid;
}
function isValidExperience(experience) {
    console.log('Checking experience validity:', experience);
    const validExperiences = ['beginner', 'intermediate', 'expert'];
    const isValid = validExperiences.includes(experience);
    console.log('Experience validity:', isValid);
    return isValid;
}
function getExperienceText(experience) {
    console.log('Converting experience to Hebrew text:', experience);
    const experienceMap = {
        'beginner': 'מתחיל',
        'intermediate': 'בינוני',
        'expert': 'מומחה'
    };
    const text = experienceMap[experience] || 'לא צוין';
    console.log('Hebrew text:', text);
    return text;
}
function isValidAvailability(availability) {
    console.log('Checking availability validity...');
    if (!Array.isArray(availability)) {
        console.log('Availability is not an array');
        return false;
    }
    const validDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const isValid = availability.every(day => validDays.includes(day));
    console.log('Availability validity:', isValid);
    return isValid;
}
function isValidWorkingHours(hours) {
    console.log('Checking working hours validity:', hours);
    if (!hours || typeof hours !== 'object') {
        console.log('Working hours are not valid');
        return false;
    }
    const { start, end } = hours;
    const isValid = isValidTime(start) && isValidTime(end) && start < end;
    console.log('Working hours validity:', isValid);
    return isValid;
}
function isValidRating(rating) {
    console.log('Checking rating validity:', rating);
    const numRating = parseFloat(rating);
    const isValid = !isNaN(numRating) && numRating >= 1 && numRating <= 5;
    console.log('Rating validity:', isValid);
    return isValid;
}
function createRatingStars(rating) {
    console.log('Creating rating stars:', rating);
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="bi bi-star-fill text-warning"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="bi bi-star-half text-warning"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="bi bi-star text-warning"></i>';
    }
    console.log('Rating stars created');
    return stars;
}
function isValidMessage(message) {
    console.log('Checking message validity...');
    const isValid = message && message.trim().length > 0 && message.length <= 1000;
    console.log('Message validity:', isValid);
    return isValid;
}
function isValidId(id) {
    console.log('Checking ID validity:', id);
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    const isValid = objectIdRegex.test(id);
    console.log('ID validity:', isValid);
    return isValid;
}
function formatReadableDate(date) {
    console.log('Creating readable date:', date);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const readableDate = new Date(date).toLocaleDateString('he-IL', options);
    console.log('Readable date:', readableDate);
    return readableDate;
}
function isValidFile(file) {
    console.log('Checking file validity...');
    if (!file) {
        console.log('No file');
        return false;
    }
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; 
    const isValidType = validTypes.includes(file.mimetype);
    const isValidSize = file.size <= maxSize;
    console.log('File validity:', isValidType && isValidSize);
    return isValidType && isValidSize;
}
console.log('Helper functions file prepared successfully!');
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