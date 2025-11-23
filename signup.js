// signup.js
const supa = window.supabaseClient;

async function signup() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("error");
  errorBox.innerText = "";

  if (!email || !password) {
    errorBox.innerText = "Email and password required.";
    return;
  }

  const { data, error } = await supa.auth.signUp({ email, password });

  if (error) {
    errorBox.innerText = error.message;
    return;
  }

  await supa.from("profiles").insert({
    id: data.user.id,
    cubemail: email
  });

  window.location.href = "dashboard.html";
}

document.getElementById("signupBtn").onclick = signup;

// redirect if already logged in
supa.auth.getSession().then(({ data }) => {
  if (data?.session) {
    window.location.href = "dashboard.html";
  }
});
