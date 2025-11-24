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

// CORS: allow all for same project
app.use(cors());

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { cubemail, password } = req.body;

    if (!cubemail || !password) {
      return res.status(400).json({ error: 'Missing cubemail or password' });
    }

    // Check if user already exists
    const { data: existingUser, error: selectError } = await supabase
      .from('profiles')
      .select('id')
      .eq('cubemail', cubemail)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // Supabase returns 116 for no rows
      return res.status(500).json({ error: selectError });
    }

    if (existingUser) {
      return res.status(400).json({ error: 'Cubemail already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('profiles')
      .insert([{ cubemail, password: hashedPassword }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(400).json({ error });
    }

    res.json({ message: 'User created successfully', data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { cubemail, password } = req.body;

    if (!cubemail || !password) {
      return res.status(400).json({ error: 'Missing cubemail or password' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('cubemail', cubemail)
      .single();

    if (error || !data) {
      return res.status(400).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, data.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.json({ message: 'Login successful', user: data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Cubemail server running on port ${PORT}`));
