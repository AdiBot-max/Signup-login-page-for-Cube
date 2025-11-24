import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { supabase } from './supabaseClient.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// __dirname setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve frontend correctly (Render requires this)
app.use(express.static(path.join(__dirname, 'public')));

// ====================== SIGNUP ======================
app.post('/signup', async (req, res) => {
  try {
    const { cubemail, password } = req.body;

    if (!cubemail || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('profiles')
      .insert([{ cubemail, password: hashed }]);

    if (error) {
      return res.status(400).json({ error });
    }

    res.json({ message: 'User created', data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ====================== LOGIN ======================
app.post('/login', async (req, res) => {
  try {
    const { cubemail, password } = req.body;

    if (!cubemail || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('cubemail', cubemail)
      .single();

    if (error || !data) {
      return res.status(400).json({ error: 'User not found' });
    }

    const match = await bcrypt.compare(password, data.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.json({ message: 'Login successful', user: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ====================== RENDER PORT ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Cubemail server running on port ${PORT}`);
});
