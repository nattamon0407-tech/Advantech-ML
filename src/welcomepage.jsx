import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import welcomeImage from '/2.png'; // Make sure this path is correct

const REDIRECT_DELAY_MS = 5000; // 5 seconds

const WelcomePage = () => {
  const [countdown, setCountdown] = useState(REDIRECT_DELAY_MS / 1000);
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  useEffect(() => {
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    // Redirect after delay (directly pass path)
    const redirectTimeout = setTimeout(() => {
      navigateRef.current('/mainpage'); // <- no constant needed
    }, REDIRECT_DELAY_MS);

    // Cleanup
    return () => {
      clearInterval(countdownInterval);
      clearTimeout(redirectTimeout);
    };
  }, []);

  return (
    <div style={styles.container}>
      <img src={welcomeImage} alt="Welcome Background" style={styles.backgroundImage} />
      <div style={styles.overlay}>
        <h1 style={styles.title}>Welcome!</h1>
        <p style={styles.message}>
          You will be redirected in {countdown} second{countdown !== 1 ? 's' : ''}
        </p>
        {countdown > 0 && <div style={styles.spinner}></div>}
      </div>
    </div>
  );
};

const styles = {
  container: { position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' },
  backgroundImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(50%)', zIndex: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', zIndex: 2, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  title: { fontSize: '3em', marginBottom: '10px' },
  message: { fontSize: '1.5em', marginBottom: '20px' },
  spinner: { border: '4px solid rgba(255,255,255,0.3)', borderTop: '4px solid #fff', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' },
};

export default WelcomePage;
