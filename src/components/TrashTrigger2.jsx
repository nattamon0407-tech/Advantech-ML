import React, { useState, useEffect, cloneElement, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function TrashTrigger2({ children }) {
  const navigate = useNavigate();
  const [navigationData, setNavigationData] = useState({ totalPoint: 0 });
  const [activityKey, setActivityKey] = useState(Date.now());
  const TIMER_DURATION = 10000;
  const handleNavigateReady = useCallback((data) => {
        setNavigationData(data); 
    }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        // navigate("/summary", { state: navigationData });
    }, TIMER_DURATION);
    return () => clearTimeout(timer);
  }, [activityKey, navigate, navigationData]);
    const handleUserActivity = () => {
    setActivityKey(Date.now());
  };

  return (
    <div>
      {children && React.isValidElement(children) && cloneElement(children, { 
            onTimerReset: handleUserActivity,
            onNavigateReady: handleNavigateReady 
      })}
   </div>
  );
}

export default TrashTrigger2;

