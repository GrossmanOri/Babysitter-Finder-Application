document.addEventListener('DOMContentLoaded', function() {
  var userTypeSelect = document.getElementById('userType');
  var babysitterFields = document.getElementById('babysitterFields');
  var parentFields = document.getElementById('parentFields');
  var form = document.getElementById('registerForm');
  var formMessage = document.getElementById('formMessage');

  function toggleFields() {
    if (userTypeSelect.value === 'babysitter') {
      babysitterFields.style.display = '';
      parentFields.style.display = 'none';
      babysitterFields.style.opacity = '0';
      setTimeout(() => {
        babysitterFields.style.opacity = '1';
        babysitterFields.style.transition = 'opacity 0.3s ease';
      }, 10);
    } else {
      babysitterFields.style.display = 'none';
      parentFields.style.display = '';
      parentFields.style.opacity = '0';
      setTimeout(() => {
        parentFields.style.opacity = '1';
        parentFields.style.transition = 'opacity 0.3s ease';
      }, 10);
    }
  }

  userTypeSelect.addEventListener('change', toggleFields);
  toggleFields();

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    formMessage.textContent = '';
    
    // הוספת אפקט טעינה לכפתור
    var submitButton = form.querySelector('button[type="submit"]');
    var originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>מעבד...';
    submitButton.disabled = true;
    
    var formData = new FormData(form);
    var userType = formData.get('userType');
    var data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
      phone: formData.get('phone'),
      userType: userType,
      city: formData.get('city')
    };
    
    // הוספת פרטים ספציפיים לפי סוג משתמש
    if (userType === 'babysitter') {
      data.age = formData.get('age');
      data.experience = formData.get('experience');
      data.hourlyRate = formData.get('hourlyRate');
      data.description = formData.get('description');
    } else {
      data.childrenCount = formData.get('childrenCount');
      data.childrenAges = formData.get('childrenAges') ? formData.get('childrenAges').split(',').map(function(x){return parseInt(x.trim(),10);}) : [];
    }
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(function(res) { return res.json(); })
    .then(function(json) {
      // החזרת הכפתור למצב רגיל
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      
      if (json.success) {
        formMessage.textContent = json.message || 'נרשמת בהצלחה! תועבר לדף ההתחברות...';
        formMessage.className = 'mb-3 text-center text-success';
        form.reset();
        toggleFields();
        
        // שמירת הטוקן אם קיים
        if (json.token) {
          localStorage.setItem('token', json.token);
          localStorage.setItem('user', JSON.stringify(json.user));
        }
        
        // הפניה לדף ההתחברות אחרי 2 שניות
        setTimeout(function() {
          window.location.href = '/pages/login.html';
        }, 2000);
      } else {
        formMessage.textContent = json.message || 'שגיאה בהרשמה';
        formMessage.className = 'mb-3 text-center text-danger';
      }
    })
    .catch(function(err) {
      // החזרת הכפתור למצב רגיל
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      
      formMessage.textContent = 'שגיאה בשרת: ' + err.message;
      formMessage.className = 'mb-3 text-center text-danger';
    });
  });
}); 