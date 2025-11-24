const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const cubemail = document.getElementById('cubemail').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cubemail, password })
  });

  const data = await res.json();

  if (data.user) {
    alert('Login successful!');
    window.location.href = 'dashboard.html';
  } else {
    alert(data.error);
  }
});
