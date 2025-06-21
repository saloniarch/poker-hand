const express = require("express");
const cors = require("cors");
const db = require("./db");

const { dealHand, resetDeck } = require("./DeckUtils");
const { analyzeHand } = require("./RankingUtils");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

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

app.post("/api/compare", (req, res) => {
  const { hands } = req.body;

  const results = hands.map((hand) => {
    const analysis = analyzeHand(hand);
    return { hand, analysis: analysis.label, rank: analysis.rank };
  });

  results.sort((a, b) => b.rank - a.rank); //Could have used if statement if only 2 players, faster
  const winner = results[0];

  res.json({ winner, allHands: results });
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

// Reset deck
app.post("/deck/reset", async (req, res) => {
  const newDeck = await resetDeck();
  res.json({ message: "Deck reset", cards: newDeck });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
