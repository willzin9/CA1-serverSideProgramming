// server/db.js
const path = require('path');
const sqlite3 = require('sqlite3').verbose();


const dbPath = path.join(__dirname, 'data', 'app.db');
const db = new sqlite3.Database(dbPath);


const INIT_SQL = `
CREATE TABLE IF NOT EXISTS user_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name   TEXT NOT NULL,
  last_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  eircode      TEXT NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;
db.serialize(() => db.run(INIT_SQL));

module.exports = db;
