const values = ['2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k', 'a'];
const suits = ['h', 'd', 'c', 's']; // Hearts, Diamonds, Clubs, Spades

// Full deck (52 cards)
function createDeck(){
    const deck = [];
    for (const value of values){
        for (const suit of suits) {
            deck.push(`${value}${suit}`);
        }
    }
    return deck;
}

function dealHand(){
    const deck = createDeck();
    const hand = [];

    while (hand.length < 5  && deck.length > 0){
        const cardIndex = Math.floor(Math.random() * deck.length);
        const card = deck[cardIndex];
        
        hand.push(card);
        deck.splice(cardIndex, 1);
    }

    return {hand, remainingDeck: deck};
}

module.exports = {dealHand, createDeck};