document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('loginForm');
  var formMessage = document.getElementById('formMessage');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    formMessage.textContent = '';
    
    var formData = new FormData(form);
    var data = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(function(res) { return res.json(); })
    .then(function(json) {
      if (json.success) {
        formMessage.textContent = json.message || 'התחברת בהצלחה!';
        formMessage.className = 'mb-3 text-center text-success';
        
        // שמירת הטוקן והמשתמש
        localStorage.setItem('token', json.token);
        localStorage.setItem('user', JSON.stringify(json.user));
        
        // הפניה לדף הראשי אחרי 1 שנייה
        setTimeout(function() {
          window.location.href = '/index.html';
        }, 1000);
      } else {
        formMessage.textContent = json.message || 'שגיאה בהתחברות';
        formMessage.className = 'mb-3 text-center text-danger';
      }
    })
    .catch(function(err) {
      formMessage.textContent = 'שגיאה בשרת: ' + err.message;
      formMessage.className = 'mb-3 text-center text-danger';
    });
  });
}); 