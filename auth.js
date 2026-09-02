// Agri-MART Auth Portal Script

function switchAuthTab(tabName) {
  const isSignIn = tabName === 'signin';
  
  // Tab buttons
  const btnSignIn = document.getElementById('tab-btn-signin');
  const btnRegister = document.getElementById('tab-btn-register');
  
  // Tab panels
  const panelSignIn = document.getElementById('panel-signin');
  const panelRegister = document.getElementById('panel-register');

  if (isSignIn) {
    btnSignIn.classList.add('active');
    btnSignIn.setAttribute('aria-selected', 'true');
    btnRegister.classList.remove('active');
    btnRegister.setAttribute('aria-selected', 'false');

    panelSignIn.classList.add('active');
    panelRegister.classList.remove('active');
  } else {
    btnRegister.classList.add('active');
    btnRegister.setAttribute('aria-selected', 'true');
    btnSignIn.classList.remove('active');
    btnSignIn.setAttribute('aria-selected', 'false');

    panelRegister.classList.add('active');
    panelSignIn.classList.remove('active');
  }

  // Clear any existing alert message
  hideAlert();
}

// Password toggle helper
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';

  // Toggle button appearance / title
  btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  btn.classList.toggle('active', isPassword);
}

// Toast / Alert Notification Helper
function showAlert(message, type = 'success') {
  const alertEl = document.getElementById('auth-alert');
  if (!alertEl) return;

  alertEl.className = `auth-alert ${type}`;
  alertEl.innerHTML = `
    <span class="alert-icon">${type === 'success' ? '✓' : type === 'info' ? 'ℹ' : '⚠'}</span>
    <span class="alert-msg">${message}</span>
  `;
  alertEl.classList.remove('hidden');

  // Scroll to alert smoothly if needed
  alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  if (type !== 'info') {
    setTimeout(() => {
      // Don't hide if user changed view
    }, 5000);
  }
}

function hideAlert() {
  const alertEl = document.getElementById('auth-alert');
  if (alertEl) {
    alertEl.className = 'auth-alert hidden';
    alertEl.innerHTML = '';
  }
}

// Quick Demo Autofill
function fillDemo(role) {
  switchAuthTab('signin');
  const emailInput = document.getElementById('signin-email');
  const passInput = document.getElementById('signin-password');

  if (role === 'farmer') {
    emailInput.value = 'farmer.ramesh@agrimart.com';
    passInput.value = 'Harvest2026!';
    showAlert('Loaded Farmer demo credentials. Click "Sign In" to continue.', 'info');
  } else if (role === 'agronomist') {
    emailInput.value = 'dr.anita.cropadvisor@agrimart.com';
    passInput.value = 'SoilHealth99#';
    showAlert('Loaded Agronomist Advisor demo credentials. Click "Sign In" to continue.', 'info');
  }
}

// Form Handlers
function handleSignIn(event) {
  event.preventDefault();
  const btn = document.getElementById('btn-signin-submit');
  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;

  if (!email || !password) {
    showAlert('Please provide your email / phone and password.', 'error');
    return;
  }

  // Button loading state
  const originalBtnContent = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `
    <span class="spinner"></span>
    <span>Authenticating...</span>
  `;

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = originalBtnContent;

    // Simulate successful login
    showAlert(`Welcome back, ${email.split('@')[0]}! Redirecting to your AI Farming Dashboard...`, 'success');

    // Save session simulation
    localStorage.setItem('agrimart_user', JSON.stringify({ email, isLoggedIn: true, loginTime: new Date() }));

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1400);
  }, 1000);
}

function handleRegister(event) {
  event.preventDefault();
  const btn = document.getElementById('btn-register-submit');
  const fullname = document.getElementById('reg-fullname').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const role = document.getElementById('reg-role').value;
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;
  const terms = document.getElementById('reg-terms').checked;

  if (password.length < 6) {
    showAlert('Password must be at least 6 characters long.', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showAlert('Passwords do not match. Please verify.', 'error');
    return;
  }

  if (!terms) {
    showAlert('Please agree to the Terms of Service & Privacy Policy.', 'error');
    return;
  }

  // Button loading state
  const originalBtnContent = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `
    <span class="spinner"></span>
    <span>Creating your account...</span>
  `;

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = originalBtnContent;

    showAlert(`Account created successfully for ${fullname} (${role})! Launching Dashboard...`, 'success');

    localStorage.setItem('agrimart_user', JSON.stringify({
      fullname,
      email,
      phone,
      role,
      isLoggedIn: true,
      registeredAt: new Date()
    }));

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1400);
  }, 1200);
}

function handleForgotPassword() {
  const email = prompt('Enter your registered email address to receive password reset instructions:');
  if (email && email.includes('@')) {
    showAlert(`Password reset link has been dispatched to ${email}.`, 'info');
  } else if (email) {
    showAlert('Please enter a valid email address.', 'error');
  }
}

function socialAuth(provider) {
  showAlert(`Connecting with ${provider} Secure OAuth...`, 'info');
  setTimeout(() => {
    showAlert(`Successfully verified with ${provider}! Launching Dashboard...`, 'success');
    localStorage.setItem('agrimart_user', JSON.stringify({
      provider,
      isLoggedIn: true,
      email: `user.${provider.toLowerCase()}@agrimart.com`
    }));
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1200);
  }, 1000);
}

// Initializer: check query params or hash for active tab
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode') || params.get('tab');
  const hash = window.location.hash.toLowerCase();

  if (mode === 'register' || mode === 'signup' || hash === '#register' || hash === '#signup') {
    switchAuthTab('register');
  } else {
    switchAuthTab('signin');
  }
});
