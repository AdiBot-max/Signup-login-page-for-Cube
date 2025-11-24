import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { supabase } from './supabaseClient.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files
app.use(express.static(__dirname));

// Allow all origins (same project)
app.use(cors());

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { cubemail, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('profiles')
    .insert([{ cubemail, password: hashedPassword }]);

  if (error) return res.status(400).json({ error });
  res.json({ message: 'User created', data });
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { cubemail, password } = req.body;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('cubemail', cubemail)
    .single();

  if (error || !data) return res.status(400).json({ error: 'User not found' });

  const validPassword = await bcrypt.compare(password, data.password);
  if (!validPassword) return res.status(401).json({ error: 'Invalid password' });

  res.json({ message: 'Login successful', user: data });
});

// Use Render dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Cubemail server running on port ${PORT}`);
});
