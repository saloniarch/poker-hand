import { useState } from 'react';
import Card from './Card';
import './App.css';
import { api } from './api';
import { Deck } from './Components/Deck';

function App() {

  const { dealNewHand, resetDeck, getWinner} = api();


  const [hand, setHand] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [firstRound, setFirstRound] = useState(true);

  const [handsToCompare, setHandsToCompare] = useState([]);
  const [winnerResult, setWinnerResult] = useState(null);


  const fetchNewHand = async () => {
    setIsLoading(true);

    try {
      const response = await dealNewHand();
      console.log("Api response.....", response);

      if (response?.error) {
        setError(response.error);
      } else if (response) {
        setHand(response.hand);
        setAnalysis(response.analysis);
        setHandsToCompare(prev => [...prev, response.hand]);
        setHistory(prev => [response, ...prev.slice(0, 9)]);
        setFirstRound(false);
      }
    } catch (error) {
    setError("Failed dealing hand");
  } finally {
    setIsLoading(false);
  }
};

const compareHands = async () => {
  if (handsToCompare.length < 2) {
    setError("At least two hands for comparison");
    return;
  }

  setIsLoading(true);
  setError(null);
  setWinnerResult(null);

  try{
    const response = await getWinner(handsToCompare);
    if (response?.error) {
      setError(response.error);
    } else {
      setWinnerResult(response);
    }
  } finally { setIsLoading(false);}
};

  const resetGame = async () => {
    setIsLoading(true);
    await resetDeck();
    setHand(null);
    setAnalysis(null);
    setHistory([]);
    setHandsToCompare([]);
    setWinnerResult(null);
    setShowHistory(false);
    setFirstRound(true);
    setIsLoading(false);

  };


  return (
    <>
      <Deck />
      <div className="controls">
        <button onClick={fetchNewHand} disabled={isLoading}>
          {isLoading ? "Dealing..." : firstRound ? "Start Game" : "Deal New Hand"}
      </button>
        
        <button onClick={compareHands} disabled={handsToCompare.length < 2 || isLoading}>
          Compare Hands
        </button>

        {winnerResult && (
          <div className="results">
            <div className="winner">
              <h3>Winning Hand:</h3>
              <comparison-display hand={winnerResult.winner.hand} />
              <p>{winnerResult.winner.analysis}</p>
            </div>
          </div>
        )}
      <button onClick={resetGame} disabled={isLoading}> Reset Game</button>
      </div>

      {error && (
        <div className ="error"> 
          <p>Error {error}</p>
          <p> {error?.toString()} </p>
          <button onClick={() => setError(null)}> Close </button>
        </div>
      )}

      {isLoading && <p> LOADING... </p>}
      
      {hand && analysis && (
        <div className="hand-container">
          <div className="current-hand">
          {hand.map((card, index) => (
            <Card key={index} cardCode={card} />
          ))}
          </div>
        <div className='hand-analysis'>
          <p><strong>{analysis.label}!</strong></p>
          </div>
        </div>
      )}

        <button onClick={() => setShowHistory(!showHistory)}>
    {showHistory ? "Hide History" : "Show History"}
  </button> 
      {showHistory && (
        <div className='history'>
          <h3>Recent Hands:</h3>
          {history.map(hand => (
            <div key={`history-${hand.id}`} className='history-hand'>
              {hand.hand.map((card, j) => (
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