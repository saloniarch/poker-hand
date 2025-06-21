const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./poker.db", (err) => {
  if (err) {
    console.error("Connecting to database error:", err.message);
  } else {
    console.log("Connected to Poker Database.");
  }
});

db.serialize(() => {
  // deck
  //  row |   id   | card
  //  1   |   1   |   2h
  //  2   |   2   |   3h
  //  3   |   3   |   4h

  // hand
  //  row |   cardId  |   cards   |   handId
  //  1   |   1       |   2h      |   1
  //  2   |   2       |   3h      |   1
  //  3   |   3       |   4h

  db.exec(`
    CREATE TABLE IF NOT EXISTS deck (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card TEXT NOT NULL UNIQUE
    )
`);

  // bruke card_Id som foreign key?
  // Og (card_Id + hand_Id) som composite primary key
  db.exec(`    
    CREATE TABLE IF NOT EXISTS hands (
    hand_id INTEGER NOT NULL,
    cards TEXT NOT NULL,
    category TEXT NOT NULL
    )
    `);
});

module.exports = db;
