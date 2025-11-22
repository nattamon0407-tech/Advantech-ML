import trashMap from "./utils/trashMap.jsx"   
import trashFetch from "./api/trashFetch.jsx"
import { useState } from "react"
import imgUnknown from '/Unknown.svg'

const DEFAULT_DATA = {
    type: 'ไม่ทราบประเภท',
    image: imgUnknown,
    point: 0,
    category: "Unknown",
    color: '#808080'
};

function Test3() {
    const [data, setData] = useState(DEFAULT_DATA);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPoint, setTotalPoint] = useState(0);

    const handleGenerateData = async () => {
        setIsLoading(true);
        try {
            const fetchData = await trashFetch();
            if (fetchData && fetchData.trashType) {
                const mappedData = trashMap(fetchData.trashType);
                setData(mappedData);
                setTotalPoint(prevPoint => prevPoint + mappedData.point);
                console.log("Fetched and Mapped Data:", mappedData);
            }
        } catch (error) {
            console.error("Error generating trash data:", error);
        } finally {
            setIsLoading(false);
        } 
    };
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
          <h1>Welcome to Advantech Main Page</h1> 
          <img src={data.image} alt={data.type} width="200" />
          <h2>{data.type}</h2>
          <p>{data.category}</p>
          <p>Point +{data.point}</p>
          <p style={{ marginTop: '20px', backgroundColor: data.color, color: 'white', padding: '10px'}}>
            Total Point {totalPoint}
          </p>
        <button type="button" onClick={handleGenerateData} disabled={isLoading}>{isLoading ? 'Loading...' : 'Generate Data'}</button>
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
export default Test3;