import { HandDisplay } from "./Hand";

export function WinnerResult({ result }) {
  if (!result) return null;

  const hands = result.isTie ? result.winners : [result.winner];

  return (
    <div className="results">
      <h3>{result.isTie ? "It's a Tie!" : "Winning Hand:"}</h3>
      {hands.map((w, i) => (
        <div key={i}>
          <HandDisplay hand={w.hand} />
          <p>{w.analysis}</p>
        </div>
      ))}
    </div>
  );
}
