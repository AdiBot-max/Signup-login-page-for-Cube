const form = document.getElementById('signupForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const cubemail = document.getElementById('cubemail').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/signup', { // relative path
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cubemail, password })
  });

  const data = await res.json();
  alert(data.message || data.error);
  if (data.message) window.location.href = 'login.html';
});
