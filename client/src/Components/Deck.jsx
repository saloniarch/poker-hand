import { api } from "../api";
import { useState } from "react";

export function Deck({}) {

  const {getDeck} = api();
  const [remainingCards, setRemaining] = useState(null);

  const handleGetDeck = async () => {
    try {
      const response = await getDeck();
      setRemaining(response.length);
    } catch (error) {
      console.error("Error while fetching deck....", error);
      setRemaining(null);
    }
  };

    return (
        <div className={"deck-display"} >
            <button onClick={handleGetDeck} className="deck-button">
              {remainingCards !== null ? remainingCards : "?"}</button>
            <div>{"Cards Left"}</div>
        </div>
    )
} 