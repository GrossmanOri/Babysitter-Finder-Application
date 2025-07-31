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
            const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:3000/api/auth/login' 
            : 'https://babysitter-finder-application.onrender.com/api/auth/login';
        fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(function(res) { return res.json(); })
    .then(function(json) {
      if (json.success) {
        formMessage.textContent = json.message || 'התחברת בהצלחה!';
        formMessage.className = 'mb-3 text-center text-success';
        localStorage.setItem('token', json.token);
        localStorage.setItem('user', JSON.stringify(json.user));
        localStorage.setItem('userData', JSON.stringify(json.user));
        console.log('נשמר בהצלחה:', { token: json.token, user: json.user });
        setTimeout(function() {
                      CLIENT_NAV.goToProfile();
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