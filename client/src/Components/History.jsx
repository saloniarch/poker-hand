import Card from "./Card";

export function History({ history }) {
  return (
    <div className="history">
      <h3>Recent Hands:</h3>
      {history.map((hand) => (
        <div key={`history-${hand.id}`} className="history-hand">
          {hand.hand.map((card) => (
            <Card key={`${hand.id}-${card}`} cardCode={card} small />
          ))}
          <span>{hand.analysis.label}</span>
        </div>
      ))}
    </div>
  );
}
