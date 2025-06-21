import axios from 'axios';

    const API_URL = "http://localhost:3001";

    export const api = () => {
        const get = async (endpoint) => {
            try {
                const response = await axios.get(`${API_URL}${endpoint}`);
                return response.data;
            }catch(error){
                console.error(`GET ${endpoint} failed:`, error);
                return {error};
            }
        };

        const post = async (endpoint, data) => {
            try {
                const response = await axios.post(`${API_URL}${endpoint}`, data, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                return response.data;
            }catch (error){
                console.error(`POST ${endpoint} failed: `, error);
                return {error};
            }
        };
        
   return {
    dealNewHand: () => get("/api/hand/new"),
    getHistory: () => get("/api/history"),
    getDeck: () => get("/deck"),
    resetDeck: () => post("/deck/reset"),
    getWinner: (hands) => post("/api/compare", {hands})
   };
};