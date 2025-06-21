import { api } from "../api";
import { useState } from "react";

export function Deck({}) {

    const {getDeck} = api();
  const [deck, setDeck] = useState(null);

  const handleGetDeck = async () => {
    let response;
    try {
      response = await getDeck();
      setDeck(response);
    } catch (error) {
      console.error("Error while fetching deck....", error);
      setDeck(null);
    }
  };

    return (
        <div className={"card"} >
            <button onClick={handleGetDeck} style={{padding: 0, border: "none", }}>
              {deck ? deck.length : "N/A"}</button>
            <div>{"Cards Remaining"}</div>
        </div>
    )
} 