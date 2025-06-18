const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(('./poker.db'), (err) => {
    if (err) {
        console.error('Connecting to database error:', err.message);
    } else {
        console.log('Connected to Poker Database.');
    }
});

db.serialize(() => {
db.run(`
    CREATE TABLE IF NOT EXISTS hands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cards TEXT NOT NULL,
    category TECT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `, (err) => {
        if (err) {
            console.error('Error creating hands table:', err.message);
        }
    });
});

module.exports = db;