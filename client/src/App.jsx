import { useState, useEffect } from 'react';
import './App.css';
import { useApi } from './useApi';

import { Deck } from "./Components/Deck";
import { Controls } from "./Components/Controls";
import { HandDisplay } from "./Components/Hand";
import { WinnerResult } from "./Components/WinnerResult";
import { ErrorMessage } from "./Components/Errors";
import { History } from "./Components/History";

function App() {

  const { getNewHand, postResetDeck, postWinner, getHistory} = useApi();

  const [firstRound, setFirstRound] = useState(true);
  const [currentHandData, setCurrentHandData] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [winnerResult, setWinnerResult] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
    useEffect(() => {
      fetchHistory();
    }, []);

    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getHistory();
        if (data?.error) {
          setError(data.error.mesasage);
        } else {
          setHistory(data);
          if (data.length > 0)
            setFirstRound(false);
        }
      } catch {
        setError("Something occured while fetching history.");
      } finally {
        setIsLoading(false);
      }
    };

  const fetchNewHand = async () => {
    setIsLoading(true);
    setError(null);
    setWinnerResult(null);

    try {
      const response = await getNewHand();
      console.log("Api response: ", response);

      if (response?.error) {
        setError(response.error);
      } else {
        setCurrentHandData({
          hand: response?.hand, 
          analysis: response?.analysis
        });
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

    const hands = history.map((h) => ({
      hand: h.hand,
      analysis: h.analysis.label,
      rank: h.analysis.rank
    }));

    const response = await postWinner(hands);
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
    await postResetDeck();
    setCurrentHandData(null);
    setHistory([]);
    setWinnerResult(null);
    setShowHistory(false);
    setFirstRound(true);
    setError(null);
    }  catch {
     setError("Failed to reset game");
    }
      setIsLoading(false);
  };

  return (
    <>
      <Deck />
      < Controls
        isLoading={isLoading}
        firstRound={firstRound}
        onDeal={fetchNewHand}
        onCompare={compareHands}
        onReset={resetGame}
        canCompare={history.length >= 2}
        ></Controls>

        <WinnerResult result={winnerResult} />

        <ErrorMessage error={error} onClose={() => setError(null)} />

        {isLoading && <p>LOADING...</p>}

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

      {showHistory &&
        <History history={history} />}
    </>
  );
}

export default App;