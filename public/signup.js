const form = document.getElementById('signupForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const cubemail = document.getElementById('cubemail').value.trim();
  const password = document.getElementById('password').value;

  if (!cubemail || !password) {
    alert('Both fields are required.');
    return;
  }

  try {
    const res = await fetch('/signup', { // relative path works on Render
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cubemail, password })
    });

    const data = await res.json();

    if (res.status >= 400) {
      console.error('Signup error:', data.error);
      alert(`Error: ${data.error?.message || data.error || 'Unknown error'}`);
    } else {
      alert(data.message);
      window.location.href = 'login.html';
    }
  } catch (err) {
    console.error('Network or server error:', err);
    alert('Server error, please try again later.');
  }
});

