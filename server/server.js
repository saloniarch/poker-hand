const express = require("express");
const cors = require("cors");
const db = require("./db");

const { createDeck, dealHand, resetDeck } = require("./DeckUtils");
const { analyzeHand } = require("./RankingUtils");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Testing to see if server is running
app.get("/", (req, res) => {
  res.send("Server is working! " + Date.now());
});

let handsHistory = [];

// Create hand and return it + analysis
app.get("/api/hand/new", async (req, res) => {
  const { hand, remainingDeck } = await dealHand();
  const analysis = analyzeHand(hand);

  const handLog = {
    id: Date.now(),
    hand,
    analysis,
    remainingDeckCount: remainingDeck.length,
  };

  handsHistory.push(handLog);
  res.json(handLog);
});

// return 10 most recent hands
app.get("/api/history", (req, res) => {
  const recentHands = handsHistory.slice(-10).reverse();

  res.json(recentHands);
});

// Get current deck from db
app.get("/deck", (req, res) => {
  db.all("SELECT * FROM deck", [], (err, rows) => {
    if (err) {
      console.error("Error getting deck......", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.delete("/deck", (req, res) => {
  db.run("DELETE FROM deck", [], function (err) {
    if (err) {
      console.error("Error deleting deck :/", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Deck cleared", changes: this.changes });
  });
});

// Reset deck
app.post("/deck/reset", async (req, res) => {
  const newDeck = await resetDeck();
  res.json({ message: "Deck reset", cards: newDeck });
});

// Respond only once after both tables are dropped
app.get("/api/reset", (req, res) => {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS deck");
    db.run("DROP TABLE IF EXISTS hands", (err) => {
      if (err) {
        console.error("Reset error (hands)", err);
        return res.status(500).send("Error resetting hands table");
      }
      res.send("Database reset successful");
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
