import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundGif from '/ReX.gif';
import './trash_main.module.css';

const REDIRECT_DELAY_MS = 5000;

const WelcomePage = () => {
  const [countdown, setCountdown] = useState(REDIRECT_DELAY_MS / 1000);
  const navigate = useNavigate();

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown(prev => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      navigate('/mainpage');
    }, REDIRECT_DELAY_MS);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <div style={styles.container}>
      {/* GIF as background */}
      <img src={backgroundGif} alt="Welcome GIF" style={styles.backgroundGif} />

      {/* Overlay content */}
      {/* <div style={styles.overlay}>
        <h1 style={styles.title}>Welcome!</h1>
        <p style={styles.message}>
          You will be redirected in {countdown} second{countdown !== 1 ? 's' : ''}
        </p>
      </div> */}
    </div>
  );
};
const styles = {
  container: { position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' },
  backgroundGif: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain', // cover entire viewport
    zIndex: 1
  },
  // overlay: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   width: '100%',
  //   height: '100%',
  //   display: 'flex',
  //   flexDirection: 'column',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   color: 'black',
  //   zIndex: 2,
  //   textAlign: 'center',
  // },
  title: { fontSize: '3em', marginBottom: '10px' },
  message: { fontSize: '1.5em', marginBottom: '20px' }
};

export default WelcomePage;
