const db = require("./db");

// Full deck (52 cards)
function createDeck() {
  const CARD_VALUES = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "t",
    "j",
    "q",
    "k",
    "a",
  ];
  const CARD_SUITES = ["h", "d", "c", "s"]; // heart, diamond, clubs, spade

  const deck = [];

  for (const value of CARD_VALUES) {
    for (const suit of CARD_SUITES) {
      deck.push(`${value}${suit}`);
    }
  }

  return deck; // I have to shuffle in database
}

function resetGame() {
  return new Promise((resolve, reject) => {
    const newDeck = createDeck();

    db.serialize(() => {
      db.run("DELETE FROM deck", [], (deleteError) => {
        if (deleteError) return reject(deleteError);

        const insertCard = db.prepare("INSERT INTO deck (card) VALUES (?)");
        newDeck.forEach((card) => insertCard.run(card));
        insertCard.finalize((insertError) => {
          if (insertError) return reject(insertError);

          db.run("DELETE FROM hands", (handsErr) => {
            if (handsErr) return reject(handsErr);
          });
          resolve(newDeck);
        });
      });
    });
  });
}

async function dealHand() {
  // select only 5 cards from deck table and return
  const handFromDB = await new Promise((resolve, reject) => {
    db.all("SELECT * FROM deck ORDER BY RANDOM() LIMIT 5", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  // create new one if deck doesn't exist / ran out of cards
  if (!handFromDB || handFromDB.length < 5) {
    await resetGame();
    return dealHand();
  }

  const hand = handFromDB.map((row) => row.card);
  const usedIds = handFromDB.map((row) => row.id);

  // Remove dealt hand from the deck
  const placeholders = usedIds.map(() => "?").join(",");
  await new Promise((resolve, reject) => {
    db.run(`DELETE FROM deck WHERE id IN (${placeholders})`, usedIds, (err) => {
      if (err) return reject(err);
      else resolve();
    });
  });

  return { hand };
}

module.exports = { createDeck, resetGame, dealHand };
