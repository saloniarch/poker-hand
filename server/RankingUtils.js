function analyzeHand(hand) {
  const isFlush = checkForFlush(hand);
  const isStraight = checkForStraight(hand);

  const valueCounts = {};
  hand.forEach((card) => {
    const value = card[0];
    if (valueCounts[value]) {
      valueCounts[value] += 1;
    } else {
      valueCounts[value] = 1;
    }
  });

  console.log(valueCounts);

  const counts = Object.values(valueCounts);
  const pairs = counts.filter((count) => count === 2).length;
  const hasTwo = pairs >= 1;
  const hasThree = counts.includes(3);
  const hasFour = counts.includes(4);

  if (isFlush && isStraight) return { rank: 1, label: "Straight Flush" };
  if (hasFour) return { rank: 2, label: "Four of a Kind" };
  if (hasThree && hasTwo) return { rank: 3, label: "Full House" };
  if (isFlush) return { rank: 4, label: "Flush" };
  if (isStraight) return { rank: 5, label: "Straight" };
  if (hasThree) return { rank: 6, label: "Three of a Kind" };
  if (pairs === 2) return { rank: 7, label: "Two Pair" };
  if (hasTwo) return { rank: 8, label: "One Pair" };
  return { rank: 9, label: "High Card" };
}

function checkForFlush(hand) {
  const suitCounts = {};

  hand.forEach((card) => {
    const suit = card[1];
    if (suitCounts[suit]) {
      suitCounts[suit] += 1;
    } else {
      suitCounts[suit] = 1;
    }
  });

  return Object.values(suitCounts).some((suitCount) => suitCount === 5);
}

// Implement wheel as well
function checkForStraight(hand) {
  const cardOrder = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "J",
    "Q",
    "K",
    "A",
  ];

  const values = hand.map((card) => card[0]);
  let positions = values
    .map((val) => cardOrder.indexOf(val))
    .sort((a, b) => a - b);

  // for wheel a2345
  const isWheel = ["A", "2", "3", "4", "5"].every((v) => values.includes(v));
  if (isWheel) return true;

  // Normal straight
  for (let i = 1; i < positions.length; i++) {
    if (positions[i] !== positions[i - 1] + 1) return false;
  }
  return true;
}

module.exports = { analyzeHand };
