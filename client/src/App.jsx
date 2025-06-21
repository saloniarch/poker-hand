import { useState } from 'react';
import Card from './Card';
import './App.css';
import { api } from './api';
import { Deck } from './Components/Deck';

function App() {

  const { dealNewHand, resetDeck} = api();


  const [hand, setHand] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchNewHand = async () => {
    setIsLoading(true);

    try {
      const response = await dealNewHand();
      console.log("Api response.....", response);

      if (response && !response?.error) {
        const { hand, analysis } = response ?? {};

        setHand(hand);
        setAnalysis(analysis);
        setHistory(prev => [response, ...prev.slice(0, 9)]);

      } else {
        setError(response.error);
        } 
      } catch (error) {
      setError("Request failed");
      console.error("Error dealing new hand:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = async () => {
    setIsLoading(true);
    await resetDeck();
    setHand(null);
    setAnalysis(null);
    setHistory([]);
    setIsLoading(false);
  };


  return (
    <>
      <Deck />
      <button onClick={fetchNewHand}>Deal New Hand</button>
      <button onClick={resetGame}> Reset Game</button>
      

      {error && (
        <div className ="error"> 
          <p> An error occurred :</p>
          <p> {error?.toString()} </p>
          <button onClick={() => setError(null)}> Close </button>
        </div>
      )}

      {isLoading && <p> LOADING... </p>}
      
      {hand && (
        <div className="hand-container">
          <div className="current-hand">
          {hand.map((card, index) => (
            <Card key={index} cardCode={card} />
          ))}
          </div>
        <div className='hand-analysis'>
          <p> This hand is: <strong>{analysis}</strong></p>
          </div>
        </div>
      )}

       {history.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => setShowHistory(prev => !prev)}>
            {showHistory ? "Hide History" : "Show History"}
          </button>
        </div>
      )}


      {showHistory && (
        <div className='history'>
          <h3>Recent Hands:</h3>
          {history.map(item => (
            <div key={item.id} className='history-item'>
              {item.hand.map((card, j) => (
                <Card key={j} cardCode={card} small />
              ))}
              <button disabled>{item.analysis}</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;