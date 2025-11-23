// login.js
const supa = window.supabaseClient;

const loginBtn = document.getElementById('loginBtn');
const gotoSignup = document.getElementById('gotoSignup');
const errorBox = document.getElementById('error');

gotoSignup?.addEventListener('click', () => (location.href = 'signup.html'));

loginBtn?.addEventListener('click', async () => {
  errorBox.textContent = '';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    errorBox.textContent = 'Please enter email and password.';
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = 'Signing in...';

  try {
    const { error } = await supa.auth.signInWithPassword({ email, password });
    if (error) {
      errorBox.textContent = error.message;
      return;
    }
    location.href = 'dashboard.html';
  } catch (err) {
    console.error(err);
    errorBox.textContent = 'Login failed.';
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
});

// Auto-login
(async () => {
  const { data } = await supa.auth.getSession();
  if (data?.session) location.href = 'dashboard.html';
})();
