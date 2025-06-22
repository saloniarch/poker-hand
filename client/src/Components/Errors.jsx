export function ErrorMessage({ error, onClose }) {
  if (!error) return null;

  return (
    <div className="error">
      <p>Error: {error.toString()}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
