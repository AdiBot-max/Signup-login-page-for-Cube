const form = document.getElementById('signupForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  let cubemail = document.getElementById('cubemail').value.trim();
  const password = document.getElementById('password').value;

  if (!cubemail.endsWith("@cubemail.com")) {
    return showAlert("Email must end with @cubemail.com", "error");
  }

  if (!cubemail || !password) {
    return showAlert("Both fields are required.", "error");
  }

  try {
    const res = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cubemail, password })
    });

    const data = await res.json();

    if (res.status >= 400) {
      return showAlert(data.error?.message || "Signup error", "error");
    }

    showAlert("Account created!", "success");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 800);

  } catch (err) {
    console.error(err);
    showAlert("Server error, try again later", "error");
  }
});
