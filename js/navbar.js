// Check if user is logged in and update navbar
const currentUser = JSON.parse(localStorage.getItem('nxtplay-current-user') || 'null');

if (currentUser) {
  const loginBtn = document.getElementById('nav-login');
  if (loginBtn) {
    loginBtn.textContent = currentUser.fullname.split(' ')[0];
    loginBtn.href = '#';

    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.id = 'user-dropdown';
    dropdown.classList.add('hidden');
    dropdown.innerHTML = `
      <p id="dropdown-name">${currentUser.fullname}</p>
      <p id="dropdown-email">${currentUser.email}</p>
      <hr id="dropdown-divider">
      <a href="orders.html" id="dropdown-orders">My Orders</a>
      <button id="dropdown-logout">Log Out</button>
    `;

    // Insert dropdown after the login button
    loginBtn.parentNode.style.position = 'relative';
    loginBtn.parentNode.appendChild(dropdown);

    // Toggle dropdown on click
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!loginBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });

    // Logout button
    document.getElementById('dropdown-logout').addEventListener('click', () => {
      localStorage.removeItem('nxtplay-current-user');
      window.location.href = '/login.html';
    });
  }
}

// Hamburger menu
const hamburger = document.getElementById('hamburger');
if (hamburger) {
  // Create mobile menu dynamically from existing nav links
  const mobileMenu = document.createElement('div');
  mobileMenu.id = 'mobile-menu';

  const navLinks = document.querySelectorAll('#nav-items a, #nav-items li a');
  navLinks.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent;
    mobileMenu.appendChild(a);
  });

  document.body.appendChild(mobileMenu);

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.textContent = '☰';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.textContent = '☰';
    }
  });
}