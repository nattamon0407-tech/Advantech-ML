import trashMap from "../src/utils/trashMap.jsx"   

function Test1() {
    let sample = '{"trashType": "General"}';
    const obj = JSON.parse(sample);
    const data = trashMap(obj.trashType);
    console.log("Test Data Mapped:", data);
return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
          <h1>Welcome to Advantech Main Page</h1> 
          <img src={data.image} alt={data.type} width="200" />
          <h2>{data.type}</h2>
          <p>{data.category}</p>
          <p>Point {data.point}</p>
          <p style={{ marginTop: '20px', backgroundColor: data.color, color: 'white', padding: '10px'}}>
            Total Point()
          </p>
      <button type="button">Generate Data</button>
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
export default Test1;