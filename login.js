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

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  let valid = true;

  if (!email) {
    showFieldError('email', 'email-error', 'Email is required.');
    valid = false;
  }

  if (!password) {
    showFieldError('password', 'password-error', 'Password is required.');
    valid = false;
  }

  if (!valid) return;

  const users = JSON.parse(localStorage.getItem('nxtplay-users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    showFieldError('email', 'email-error', 'Incorrect email or password.');
    showFieldError('password', 'password-error', 'Incorrect email or password.');
    return;
  }

  localStorage.setItem('nxtplay-current-user', JSON.stringify(user));
  showAlert('Login successful! Redirecting...', false);
  setTimeout(() => { window.location.href = 'index.html'; }, 1500);
});