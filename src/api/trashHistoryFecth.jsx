const API_HISTORY_ENDPOINT = 'http://localhost:8000/history';

async function trashHistoryFetch() {
    try {
        const response = await fetch(API_HISTORY_ENDPOINT);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Error fetching history data:", error);
        throw error;
    }
}

export default trashHistoryFetch;