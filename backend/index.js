const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: (origin, cb) => cb(null, true),
  methods: ['POST', 'GET'],
}));

function validateEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(pw) {
  return typeof pw === 'string' && pw.length >= 8;
}

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'invalid email' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'password must be at least 8 characters' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const stmt = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
    stmt.run([name, email, passwordHash], function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(409).json({ error: 'email already registered' });
        }
        console.error(err);
        return res.status(500).json({ error: 'database error' });
      }
      return res.status(201).json({ id: this.lastID, name, email });
    });
    stmt.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
