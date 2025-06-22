import { useApi } from "../useApi";
import { useState } from "react";

export function Deck({}) {

  const {getDeck} = useApi();
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