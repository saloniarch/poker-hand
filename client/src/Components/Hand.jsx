import Card from './Card';

export function HandDisplay({ hand, small }) {
  return (
    <div className={small ? "comparison-display" : "current-hand"}>
      {hand.map((card, index) => (
        <Card key={index} cardCode={card} small={small} />
      ))}
    </div>
  );
}
