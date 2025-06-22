export function Controls({
  isLoading,
  firstRound,
  onDeal,
  onCompare,
  onReset,
  canCompare
}) {
  return (
    <div className="controls">
      <button onClick={onDeal} disabled={isLoading}>
        {isLoading ? "Dealing..." : firstRound ? "Start Game" : "Deal New Hand"}
      </button>

      <button onClick={onCompare} disabled={!canCompare || isLoading}>
        Compare Hands
      </button>

      <button onClick={onReset} disabled={isLoading || firstRound}>
        Reset Game
      </button>
    </div>
  );
}
