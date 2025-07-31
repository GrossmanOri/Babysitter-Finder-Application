document.addEventListener('DOMContentLoaded', function() {
  var userTypeSelect = document.getElementById('userType');
  var babysitterFields = document.getElementById('babysitterFields');
  var form = document.getElementById('registerForm');
  var formMessage = document.getElementById('formMessage');
  var detectLocationBtn = document.getElementById('detectLocationBtn');
  var cityInput = document.getElementById('cityInput');
  function toggleFields() {
    if (userTypeSelect.value === 'babysitter') {
      babysitterFields.style.display = '';
      babysitterFields.style.opacity = '0';
      setTimeout(() => {
        babysitterFields.style.opacity = '1';
        babysitterFields.style.transition = 'opacity 0.3s ease';
      }, 10);
    } else {
      babysitterFields.style.display = 'none';
    }
  }
  userTypeSelect.addEventListener('change', toggleFields);
  toggleFields();
  console.log('Register page loaded, checking geolocation elements...');
  console.log('detectLocationBtn:', detectLocationBtn);
  console.log('cityInput:', cityInput);
  console.log('window.geolocationService:', window.geolocationService);
  if (detectLocationBtn) {
    console.log('Geolocation button found');
  }
  if (detectLocationBtn && cityInput) {
    console.log('Geolocation elements found, adding event listener...');
    detectLocationBtn.addEventListener('click', async function() {
      console.log('Location button clicked!');
      let originalText = detectLocationBtn.innerHTML;
      try {
        detectLocationBtn.innerHTML = '<i class="bi bi-hourglass-split"></i>';
        detectLocationBtn.disabled = true;
        console.log('Calling geolocation service...');
        await window.geolocationService.autoDetectCity(cityInput);
        showMessage('העיר זוהתה בהצלחה!', 'success');
        console.log('Geolocation successful!');
      } catch (error) {
        console.error('Error detecting location:', error);
        showMessage(error.message || 'שגיאה בזיהוי המיקום', 'danger');
      } finally {
        detectLocationBtn.innerHTML = originalText;
        detectLocationBtn.disabled = false;
      }
    });
    console.log('Event listener added successfully');
  } else {
    console.error('Geolocation elements not found!');
    console.log('detectLocationBtn exists:', !!detectLocationBtn);
    console.log('cityInput exists:', !!cityInput);
  }
  function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `mb-3 text-center text-${type}`;
    setTimeout(() => {
      formMessage.textContent = '';
      formMessage.className = '';
    }, 5000);
  }
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    formMessage.textContent = '';
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
    if (userType === 'babysitter') {
      data.experience = formData.get('experience');
      data.hourlyRate = formData.get('hourlyRate');
      data.description = formData.get('description');
      data.isAvailable = formData.get('isAvailable') === 'true';
    }
            const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:3000/api/auth/register' 
            : 'https://babysitter-finder-application.onrender.com/api/auth/register';
        fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(function(res) { return res.json(); })
    .then(function(json) {
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      if (json.success) {
        formMessage.textContent = json.message || 'נרשמת בהצלחה! תועבר לדף ההתחברות...';
        formMessage.className = 'mb-3 text-center text-success';
        form.reset();
        toggleFields();
        if (json.token) {
          localStorage.setItem('token', json.token);
          localStorage.setItem('user', JSON.stringify(json.user));
          localStorage.setItem('userData', JSON.stringify(json.user));
          console.log('נשמר בהצלחה:', { token: json.token, user: json.user });
        }
        setTimeout(function() {
                      CLIENT_NAV.goToProfile();
        }, 2000);
      } else {
        formMessage.textContent = json.message || 'שגיאה בהרשמה';
        formMessage.className = 'mb-3 text-center text-danger';
      }
    })
    .catch(function(err) {
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      formMessage.textContent = 'שגיאה בשרת: ' + err.message;
      formMessage.className = 'mb-3 text-center text-danger';
    });
  });
}); 