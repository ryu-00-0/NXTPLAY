function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-group input').forEach(el => el.classList.remove('input-error'));
}

function showFieldError(inputId, errorId, message) {
  document.getElementById(inputId).classList.add('input-error');
  document.getElementById(errorId).textContent = message;
}

function showAlert(message, isError = true) {
  const box = document.getElementById('alert-box');
  const msg = document.getElementById('alert-message');
  msg.textContent = message;
  box.style.borderColor = isError ? '#ff4444' : '#4ade80';
  box.style.borderLeftColor = isError ? '#ff4444' : '#4ade80';
  box.classList.remove('hidden');
  setTimeout(() => box.classList.add('hidden'), 3000);
}

// Clear field error on input
document.querySelectorAll('.form-group input').forEach(input => {
  input.addEventListener('input', function() {
    this.classList.remove('input-error');
    const errorSpan = this.closest('.form-group').querySelector('.field-error');
    if (errorSpan) errorSpan.textContent = '';
  });
});

document.getElementById('login-btn').addEventListener('click', () => {
  clearErrors();

  const fullname = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const street = document.getElementById('street').value.trim();
  const city = document.getElementById('city').value.trim();
  const zip = document.getElementById('zip').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm-password').value;

  let valid = true;

  if (!fullname) {
    showFieldError('fullname', 'fullname-error', 'Full name is required.');
    valid = false;
  }

  if (!email) {
    showFieldError('email', 'email-error', 'Email is required.');
    valid = false;
  }

  if (!phone) {
    showFieldError('phone', 'phone-error', 'Phone number is required.');
    valid = false;
  }

  if (!street) {
    showFieldError('street', 'street-error', 'Street address is required.');
    valid = false;
  }

  if (!city) {
    showFieldError('city', 'city-error', 'City or municipality is required.');
    valid = false;
  }

  if (!zip) {
    showFieldError('zip', 'zip-error', 'ZIP code is required.');
    valid = false;
  }

  if (!password) {
    showFieldError('password', 'password-error', 'Password is required.');
    valid = false;
  } else if (password.length < 6) {
    showFieldError('password', 'password-error', 'Password must be at least 6 characters.');
    valid = false;
  }

  if (!confirm) {
    showFieldError('confirm-password', 'confirm-error', 'Please confirm your password.');
    valid = false;
  } else if (password && confirm !== password) {
    showFieldError('confirm-password', 'confirm-error', 'Passwords do not match.');
    valid = false;
  }

  if (!valid) return;

  const users = JSON.parse(localStorage.getItem('nxtplay-users') || '[]');
  const exists = users.find(u => u.email === email);
  if (exists) {
    showFieldError('email', 'email-error', 'An account with this email already exists.');
    return;
  }

  users.push({ fullname, email, phone, street, city, zip, password });
  localStorage.setItem('nxtplay-users', JSON.stringify(users));
  showAlert('Account created! Redirecting to login...', false);
  setTimeout(() => { window.location.href = 'login.html'; }, 1500);
});