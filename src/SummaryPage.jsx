import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect} from 'react';



function SummaryPage() {
  const location = useLocation();
  const totalPoint = location.state?.totalPoint || 0;
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  // Automatically go back to homepage after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    // Clear timeout if component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);


  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%', 
      fontSize: '50px',
      fontWeight: 'bold',
      marginTop : "50px"
    }}>
      <p>Total</p>
      <p style={{fontSize: '60px', color: "#ff751f"}}>{totalPoint}</p>
      <p>points</p>  
      <p style={{backgroundColor: "#ff751f",color:"white",borderRadius:"100px", marginLeft:'120px',marginRight:'120px', marginTop:'20px',paddingLeft:'20px',paddingRight:'20px', fontSize:'40px'}}>Thank you!</p>
      <div style={{ display: 'flex', alignItems: 'center', marginTop:'20px'}}>
      <img src="./21.png" style={{
      position: 'fixed',
      bottom: '50px',   // ระยะห่างจากล่าง
      left: '20px',     // ระยะห่างจากซ้าย
      width: '100px',
      zIndex: 1000
    }}/>
      <img src="./22.png"style={{ 
        position: 'fixed',
      bottom: '50px',   // ระยะห่างจากล่าง
      right: '20px',     // ระยะห่างจากซ้าย
      width: '100px',
      zIndex: 1000}}/>
      </div>  
      {/* Optional button */}
      {/* <button type="button" onClick={handleGoBack}><p style={{fontSize:'30px'}}>back</p></button> */}
          <svg style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4vh',
            width: '100vw',
            zIndex: 1000}}>
            <rect x="0" y="0" width="100%" height="100%" fill="#ff751f"/>
          </svg>
          
    </div>
  );
}

export default SummaryPage;
