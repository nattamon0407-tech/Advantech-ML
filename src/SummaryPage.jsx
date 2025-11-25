import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

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
      fontSize: '45px',
      fontWeight: 'bold'
    }}>
      <p>Total</p>
      <p style={{fontSize: '60px', color: "#ff751f"}}>{totalPoint}</p>
      <p>points</p>
      {/* Optional button */}
      <button type="button" onClick={handleGoBack}><p style={{fontSize:'30px'}}>back</p></button>
    </div>
  );
}

export default SummaryPage;
