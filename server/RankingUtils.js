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
  const hasTwo = counts.includes(2);
  const hasThree = counts.includes(3);
  const hasFour = counts.includes(4);

  if (isFlush && isStraight) return "Strrrraight Flush!!";
  if (hasFour) return "Four of a Kind!";
  if (hasThree && hasTwo) return "Full House!";
  if (isFlush) return "Flush!";
  if (isStraight) return "Straight!";
  if (hasThree) return "Three of a Kind!";
  if (counts.filter((valueCount) => valueCount === 2).length === 2)
    return "Two Pairs";
  if (hasTwo) return "One Pair";

  return "High Card";
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

  const positions = values.map((val) => cardOrder.indexOf(val));
  console.log("sorted positions.....", positions);

  positions.sort((a, b) => a - b);

  for (let i = 1; i < positions.length; i++) {
    if (positions[i] !== positions[i - 1] + 1) {
      return false;
    }
  }

  return true;
}

module.exports = { analyzeHand, checkForFlush, checkForStraight };
