const express = require("express");
const cors = require("cors");
const db = require("./db");

const { dealHand, resetGame } = require("./DeckUtils");
const { analyzeHand } = require("./RankingUtils");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Create hand and return it + analysis
app.get("/api/hand/new", async (req, res) => {
  const { hand, remainingDeck } = await dealHand();
  const analysis = analyzeHand(hand);

  const handLog = {
    hand: JSON.stringify(hand),
    analysis: JSON.stringify(analysis),
    remainingDeckCount: remainingDeck.length,
  };

  db.run(
    `INSERT INTO hands (hand, analysis, remainingDeckCount) VALUES (?, ?, ?)`,
    [handLog.hand, handLog.analysis, handLog.remainingDeckCount],
    function (err) {
      if (err) {
        console.error(
          "Something occurred while inserting hand in database:",
          err
        );
        return res.status(500).json({ error: "Database insert error" });
      }

      res.json({
        id: this.lastID,
        ...handLog,
        analysis: JSON.parse(handLog.analysis),
        hand: JSON.parse(handLog.hand),
      });
    }
  );
});

// return 10 most recent hands
app.get("/api/history", (req, res) => {
  db.all(
    `SELECT id, hand, analysis, remainingDeckCount, timestamp
    FROM hands
    ORDER BY timestamp DESC
    LIMIT 10`,
    [],
    (err, rows) => {
      if (err) {
        console.error("Error fetching history:", err);
        return res.status(500).json({ error: err.message });
      }
      const parsedRows = rows.map((row) => ({
        ...row,
        hand: JSON.parse(row.hand),
        analysis: JSON.parse(row.analysis),
      }));
      res.json(parsedRows);
    }
  );
});

// Decide which hand is the winner or tie
app.post("/api/compare", (req, res) => {
  const { hands } = req.body;

  if (!hands || hands.length < 2) {
    return res.status(400).json({ error: "Need at least two hands" });
  }

  const results = hands.map(({ hand }) => {
    const analysis = analyzeHand(hand);
    return {
      hand,
      analysis: analysis.label,
      rank: analysis.rank,
    };
  });

  function findWinner(results) {
    results.sort((a, b) => a.rank - b.rank);
    const bestRank = results[0].rank;
    return results.filter((r) => r.rank === bestRank);
  }

  const winners = findWinner(results);
  const isTie = winners.length > 1;
  let winner = null;
  if (!isTie) {
    winner = winners[0];
  }
  res.json({ winner, winners, allHands: results, isTie });
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
  const newDeck = await resetGame();
  res.json({ message: "Game reset", cards: newDeck });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
