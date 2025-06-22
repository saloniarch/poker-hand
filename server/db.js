const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./poker.db", (err) => {
  if (err) {
    console.error("Connecting to database error:", err.message);
  } else {
    console.log("Connected to Poker Database.");
  }
});

db.serialize(() => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS deck (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card TEXT NOT NULL UNIQUE
    )
`);

  db.exec(`    
    CREATE TABLE IF NOT EXISTS hands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hand TEXT NOT NULL,
    analysis TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `);
});

module.exports = db;
