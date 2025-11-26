import trashMap from "./utils/trashMap.jsx"   
import trashFetch from "./api/trashFetch.jsx"
import { useState, useEffect } from "react"
import imgUnknown from '/Unknown.svg'
import "./trash_main.module.css"

const DEFAULT_DATA = {
    type: 'ไม่ทราบประเภท',
    image: imgUnknown,
    point: 0,
    category: "Unknown",
    color: '#808080'
};

function TrashDisplay({ onTimerReset, onNavigateReady }) {
    const [data, setData] = useState(DEFAULT_DATA);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPoint, setTotalPoint] = useState(0);
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        if (onNavigateReady) {
              onNavigateReady({ 
                totalPoint: totalPoint,
              });
        }
    }, [totalPoint, onNavigateReady]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountdown(prevCount => {
                if (prevCount <= 1) {
                    return 10;
                }
                return prevCount - 1;
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const handleGenerateData = async () => {
        setIsLoading(true);
        setCountdown(10);
        if (onTimerReset) {
            onTimerReset();
        }
        console.log("1. Starting API call...");
        try {
            const fetchData = await trashFetch();
            console.log("2. API call succeeded.");
            if (fetchData && fetchData.trashType) {
                const mappedData = trashMap(fetchData.trashType);
                setData(mappedData);
                setTotalPoint(prevPoint => prevPoint + mappedData.point);
                console.log("Fetched and Mapped Data:", mappedData);
            }
        } catch (error) {
            console.error("3. Error during API call:", error);
        } finally {
            setIsLoading(false);
        } 
    };
    
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%',marginTop : "-5px"}}>
          <img src={data.image} alt={data.type} width={"300"} />
          <h2>{data.type}</h2>
          <p>{data.category}</p>
          <p style={{fontSize : '70px'}} > +{data.point} Points</p> 
          <p style={{ marginTop: '1px', backgroundColor: data.color, color: 'white', padding: '10px', borderRadius: '60px', fontSize: "30px", paddingLeft:"20px", paddingRight:"20px"}}>
            Total {totalPoint} Points
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <img src="./21.png" style={{width: "100px"}}/>
            <p style={{ marginTop: '10px', fontSize: '1.2em', fontWeight: 'bold', paddingLeft:"150px", paddingRight:"150px"}}>
            Time Remaining: {countdown} seconds
          </p>
            <img src="./22.png"style={{width : "100px"}}/>
          </div>
          
          {/* <button type="button" onClick={handleGenerateData} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Generate Data'}</button> */}
         
          <svg style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4vh',
            width: '100vw',
            zIndex: 1000}}>
            <rect x="0" y="0" width="100%" height="100%" fill={data.color} />
          </svg>
          
      </div>
    );
}
export default TrashDisplay;