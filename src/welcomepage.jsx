import { useState, useEffect } from 'react';
// Assuming the image file is named '2.png' 
// and is located in your project's source directory (e.g., in 'public' or 'src/assets').
// Update the path below to match your project's structure.
import welcomeImage from '/2.png';

// IMPORTANT: Replace '/Advantech-ML/mainpage' with the actual path 
// to the page you want to redirect to after 5 seconds.
const REDIRECT_URL = '/Advantech-ML/mainpage'; 

// Set the time delay for the redirect in milliseconds (5 seconds)
const REDIRECT_DELAY_MS = 5000; 

const WelcomePage = () => {
  // State to track the countdown for display
  const [countdown, setCountdown] = useState(REDIRECT_DELAY_MS / 1000);

  useEffect(() => {
    // 1. Set up the countdown interval for display
    const countdownInterval = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown > 1) {
          return prevCountdown - 1;
        } else {
          // Clear the countdown interval when it hits 1
          clearInterval(countdownInterval);
          return 0;
        }
      });
    }, 1000);

    // 2. Set up the timeout for the actual redirection
    const redirectTimeout = setTimeout(() => {
      // Redirect to the desired page
      window.location.href = REDIRECT_URL;
      
      // OPTIONAL: If using 'react-router-dom' with the 'useNavigate' hook:
      // const navigate = useNavigate();
      // navigate(REDIRECT_URL);
    }, REDIRECT_DELAY_MS);

    // 3. Cleanup function: Runs when the component unmounts 
    // or before the effect runs again (to prevent memory leaks/unexpected behavior).
    return () => {
      clearTimeout(redirectTimeout);
      clearInterval(countdownInterval);
    };
  }, []); // Empty dependency array ensures this effect runs only ONCE after initial render

  return (
    <div style={styles.container}>
      {/* Full-screen background image */}
      <img 
        src={welcomeImage} 
        alt="Welcome Background" 
        style={styles.backgroundImage} 
      />

      {/* Overlay for text and spinner */}
      <div style={styles.overlay}>
        <h1 style={styles.title}>Welcome!</h1>
        <p style={styles.message}>
          You will be redirected in {countdown} second{countdown !== 1 ? 's' : ''}
        </p>
        {/* Optional: Add a simple loader/spinner */}
        {countdown > 0 && <div style={styles.spinner}></div>}
        
        {/* Optional: Add a manual link just in case the redirect fails or is blocked */}
        {/* <a href={REDIRECT_URL} style={styles.manualLink}>Click here to go now.</a> */}
      </div>
    </div>
  );
};

// Basic CSS-in-JS styling for the component
const styles = {
  container: {
    position: 'relative',
    width: '100vw',     // fill viewport width
    height: '100vh',    // fill viewport height
    overflow: 'hidden', // hide overflow
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',   // ensures the image covers the area
    filter: 'brightness(50%)', // darken image for better text readability
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // optional dark overlay
  },
  title: {
    fontSize: '3em',
    marginBottom: '10px',
  },
  message: {
    fontSize: '1.5em',
    marginBottom: '20px',
  },
  spinner: {
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid #fff',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  },
  manualLink: {
    color: '#00ccff',
    textDecoration: 'none',
    fontSize: '1em',
  },
};



export default WelcomePage;
