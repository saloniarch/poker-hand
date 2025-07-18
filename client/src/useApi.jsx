import axios from 'axios';

    const API_URL = import.meta.env.VITE_API_URL;

    export const useApi = () => {
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
    getNewHand: () => get("/api/hand/new"),
    getHistory: () => get("/api/history"),
    getDeck: () => get("/deck"),
    postResetDeck: () => post("/deck/reset"),
    postWinner: (hands) => post("/api/compare", {hands})
   };
};