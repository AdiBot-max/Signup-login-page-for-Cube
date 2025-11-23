// dashboard.js
const client = window.supabaseClient;
const emailBox = document.getElementById('emailBox');
const profileArea = document.getElementById('profileArea');
const logoutBtn = document.getElementById('logoutBtn');

(async () => {
  try {
    const { data } = await client.auth.getSession();
    if (!data?.session) { location.href = 'login.html'; return; }

    const user = data.session.user;
    // fetch profile
    const { data: profile, error } = await client.from('profiles').select('cubemail,email,created_at,updated_at').eq('id', user.id).single();
    if (error) {
      console.warn('Profile read error:', error.message);
      emailBox.innerText = 'Logged in as: ' + (user.email || 'unknown');
      profileArea.innerText = 'No profile found.';
    } else {
      const display = profile?.cubemail || profile?.email || user.email;
      emailBox.innerText = 'Logged in as: ' + display;
      profileArea.innerText = JSON.stringify(profile, null, 2);
    }
  } catch (err) {
    console.error(err);
    emailBox.innerText = 'Failed to load user.';
    profileArea.innerText = '';
  }
})();

logoutBtn?.addEventListener('click', async () => {
  await client.auth.signOut();
  location.href = 'login.html';
});
