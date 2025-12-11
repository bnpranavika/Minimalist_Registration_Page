const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = process.env.DATABASE_FILE || path.join(__dirname, 'users.db');

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
