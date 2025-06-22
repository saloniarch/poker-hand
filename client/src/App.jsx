import { useState, useEffect } from 'react';
import Card from './Components/Card';
import './App.css';
import { api } from './api';
import { Deck } from './Components/Deck';
import { HandDisplay } from './Components/Hand';

function App() {

  const { dealNewHand, resetDeck, getWinner, getHistory} = api();

  const [firstRound, setFirstRound] = useState(true);

  const [currentHandData, setCurrentHandData] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [winnerResult, setWinnerResult] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getHistory();
      if (data.error) {
        setError(data.error.message || "Error fetching history");
      } else {
        setHistory(data);
        if (data.length > 0) {
          setFirstRound(false);
        }
      } 
      } catch {
        setError("Error fetching history.");
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchHistory();
    }, []);

  const fetchNewHand = async () => {
    setIsLoading(true);
    setError(null);
    setWinnerResult(null);

    try {
      const response = await dealNewHand();
      console.log("Api response: ", response);

      if (response?.error) {
        setError(response.error);
      } else if (response) {
        setCurrentHandData({hand: response.hand, analysis: response.analysis});
        await fetchHistory();
        setFirstRound(false);
      }
    } catch (error) {
    setError("Failed dealing hand");
  } finally {
    setIsLoading(false);
  }
};

const compareHands = async () => {
  if (history.length < 2) {
    setError("At least two hands for comparison");
    return;
  }
  setIsLoading(true);
  setError(null);
  setWinnerResult(null);

  try{
    const hands = history.map(h => ({
      hand: h.hand,
      analysis: h.analysis.label,
      rank: h.analysis.rank
    }));

    const response = await getWinner(hands);
    if (response?.error) {
      setError(response.error);
    } else {
      setWinnerResult(response);
    }
  } finally { setIsLoading(false);
  }
};

  const resetGame = async () => {
    setIsLoading(true);
  try {
    await resetDeck();
    setCurrentHandData(null);
    setHistory([]);
    setWinnerResult(null);
    setShowHistory(false);
    setFirstRound(true);
    setIsLoading(false);
  } catch (error) {
    setError("Failed to reset game");
  }
  };

  return (
    <>
      <Deck />
      <div className="controls">
        <button onClick={fetchNewHand} disabled={isLoading}>
          {isLoading ? "Dealing..." : firstRound ? "Start Game" : "Deal New Hand"}
      </button>
        
        <button onClick={compareHands} disabled={history.length < 2 || isLoading}>
          Compare Hands
        </button>

        {winnerResult && (
          <div className="results">
            <h3>{winnerResult.isTie ? "It's a Tie!" : "Winning Hand:"}</h3>
            {(winnerResult.isTie ? winnerResult.winners : [winnerResult.winner]).map((w, i) => (
              <div key={i}>
                <HandDisplay hand={w.hand} />
                <p>{w.analysis}</p>
              </div>
            ))}
          </div>
        )}

        <button onClick={resetGame} disabled={isLoading || firstRound}> Reset Game</button>
      </div>

      {error && (
        <div className ="error"> 
          <p>Error {error}</p>
          <p> {error?.toString()} </p>
          <button onClick={() => setError(null)}> Close </button>
        </div>
      )}

      {isLoading && <p> LOADING... </p>}
      
      {currentHandData && (
        <div className="hand-container">
          <HandDisplay hand ={currentHandData.hand} />
          <div className='hand-analysis'>
            <p><strong>{currentHandData.analysis.label}!</strong></p>
            </div>
          </div>
        )}

        <button onClick={() => setShowHistory(!showHistory)} disabled={firstRound}>
          {showHistory ? "Hide History" : "Show History"}
        </button>

      {showHistory && (
        <div className='history'>
          <h3>Recent Hands:</h3>
          {history.map(hand => (
            <div key={`history-${hand.id}`} className='history-hand'>
              {hand.hand.map((card) => (
                <Card key={`${hand.id}-${card}`} cardCode={card} small />
              ))}
              <span>{hand.analysis.label}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;