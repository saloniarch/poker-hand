function getCard(cardCode){
    const [valueCode, suitCode] = cardCode.split('');

    const valueMap = {
        't' : '10', 
        'j' : 'J', 
        'q' : 'Q',
        'k' : 'K', 
        'a' : 'A'
    };

  const suitMap = {
    'h': { symbol: '♥', color: 'red' },
    'd': { symbol: '♦', color: 'red' },
    'c': { symbol: '♣', color: 'black' },
    's': { symbol: '♠', color: 'black' }
  };

  return {
    value: valueMap[valueCode] || valueCode,
    symbol: suitMap[suitCode].symbol,
    color: suitMap[suitCode].color
  };
}

export default function Card({cardCode}) {
    const { value, symbol, color } = getCard(cardCode);

    return (
        <div className={`card ${color}`}>
            <div className="card-value">{value}</div>
            <div className="card-suit">{symbol}</div>
        </div>
    )
}