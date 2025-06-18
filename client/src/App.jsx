import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';
import './App.css';

function App() {
  const [hand, setHand] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);

const dealNewHand = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/hand/new');
    
    setHand(response.data.hand);
    setAnalysis(response.data.analysis);
    setHistory(prev => [response.data, ...prev.slice(0,4)]);

  } catch (error) {
    console.error('Error dealing new hand:', error);
  }
};

  return (
    <div className="app">
      <h1>Poker Hand Analyzer</h1>
      <button onClick={dealNewHand}>Deal New Hand</button>
      
      {hand && (
        <div className="hand-container">
          <div className="current-hand">
          {hand.map((card, index) => (
            <Card key={index} cardCode={card} />
          ))}
        </div>
        <div className='hand-analysis'>
          {analysis && <p> This hand is: <strong>{analysis.category}</strong></p>}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className='history'>
        <h3>Recent Hands:</h3>
        {history.map((item, i) => (
          <div key={i} className='history-item'>
          {item.hand.map((card, j) => (
            <Card key={j} cardCode={card} small />
          ))}
          <span>{item.analysis.category}</span>
          </div>
        ))}
        </div>
      )}
      </div>
    );
  }

export default App;