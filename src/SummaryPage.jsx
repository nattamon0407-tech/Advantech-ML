import { useNavigate, useLocation } from 'react-router-dom';

function SummaryPage() {
  const location = useLocation();
  const totalPoint = location.state?.totalPoint || 0;
  const navigate = useNavigate();
  const handleGoBack = () => {
        navigate('/');
  };

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
      <button type="button" onClick={handleGoBack}>Main
      </button>
    </div>
  );
}
export default SummaryPage;