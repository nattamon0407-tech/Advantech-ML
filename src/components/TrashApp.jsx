import { useState } from "react";
import trashFetch from '../api/trashFetch.jsx';
import trashMap from "../utils/trashMap.jsx";

function TrashApp({ onUserClick }) {
  const [currentTrash, setCurrentTrash] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const handleGenerateTrash = async () => {
    setIsLoading(true);
    try {
      if (onUserClick) {
        onUserClick();
      }
      const fetchData = await trashFetch();
      if (fetchData && fetchData.trashType) {
        const mappedData = trashMap(fetchData.trashType);
        setCurrentTrash(mappedData);
        setTotalScore(prevScore => prevScore + mappedData.point);
      }
    } catch (error) {
      console.error("Error generating trash data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {currentTrash && (
        <div style={{ marginTop: '20px', border: `2px solid ${currentTrash.color}`, padding: '15px' }}>
          <h1>Welcome to Advantech Main Page</h1> 
          <img src={currentTrash.image} alt={currentTrash.type} width="200" />
          <h2>{currentTrash.type}</h2>
          <p>{currentTrash.category}</p>
          <p>Point: {currentTrash.point}</p>
          <p>Total Point {totalScore}</p>
        </div>
      )}
      <button
        type="button"
        onClick={handleGenerateTrash}
        disabled={isLoading}
      >
        Generate Data
      </button>
    </div>
  );
}

export default TrashApp;