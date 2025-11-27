// import { useState, useEffect } from 'react'; // useState is not needed. useEffect is needed.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundGif from '/ReX.gif';
import './trash_main.module.css';

const REDIRECT_DELAY_MS = 5000;

const WelcomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set a timeout to navigate to '/mainpage' after the delay
    const redirectTimeout = setTimeout(() => {
      navigate('/mainpage');
    }, REDIRECT_DELAY_MS);

    // Cleanup function: Clear the timeout when the component unmounts
    // or before the effect runs again (though it runs only once here due to [])
    return () => {
      clearTimeout(redirectTimeout);
    };
  }, [navigate]); // Dependency array: Re-run effect if 'navigate' changes (it won't, but it's a good practice for linter)

  return (
    <div style={styles.container}>
      {/* GIF as background */}
      <img src={backgroundGif} alt="Welcome GIF" style={styles.backgroundGif} />
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
    objectFit: 'cover', // Changed from 'contain' to 'cover' to ensure it fills the viewport completely
    zIndex: 1
  }
};

export default WelcomePage;
