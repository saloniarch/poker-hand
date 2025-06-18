const express = require('express');
const cors = require('cors');
const { dealHand } = require('./cardUtils');

const app = express();

app.use(cors());

// Add body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Just to test the connection :) 
app.get('/', (req, res) => {
  res.send('Server is working!');
});

app.get('/api/hand/new', (req, res) => {
    const hand = dealHand();
    //const analysis = analyzedHand(hand);
});

/* db.run(
    'INSERT INTO hands (cards, category) VALUES (?, ?)',
    [JSON.stringify(hand), analysis.category],
    (err) => {
        if (err) return res.status(500).send('Database error');
        res.json({ hand, analysis});
    }
)*/

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});