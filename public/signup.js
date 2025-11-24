const form = document.getElementById('signupForm');
const alertBox = document.getElementById('alertBox');

function showAlert(text, type = 'error') {
  alertBox.textContent = text;
  alertBox.className = 'alert ' + type;
  alertBox.style.display = 'block';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  let cubemail = document.getElementById('cubemail').value.trim();
  const password = document.getElementById('password').value;

  if (!cubemail || !password) {
    return showAlert("All fields are required.", "error");
  }

  // Force user to type full email
  if (!cubemail.endsWith("@cubemail.com")) {
    return showAlert("Cubemail must end with @cubemail.com", "error");
  }

  try {
    const res = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cubemail, password })
    });

    const data = await res.json();

    if (res.status >= 400) {
      return showAlert(data.error?.message || data.error || "Unknown error", "error");
    }

    showAlert("Signup successful! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);

  } catch (err) {
    showAlert("Server error, try again later.", "error");
  }
});
