import { supabase } from './supabaseClient.js';

async function loadEmails() {
  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return console.error(error);

  const container = document.getElementById('emails');
  container.innerHTML = '';

  data.forEach(email => {
    const div = document.createElement('div');
    div.textContent = `From: ${email.from} | Subject: ${email.subject}`;
    container.appendChild(div);
  });
}

loadEmails();
