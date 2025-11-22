import React, { useState, useEffect, cloneElement } from 'react';
import { useNavigate } from 'react-router-dom';

function TrashTrigger({ children }) {
  const navigate = useNavigate();
  const [activityKey, setActivityKey] = useState(Date.now());
  const TIMER_DURATION = 10000;

  useEffect(() => {
    const timer = setTimeout(() => {
        navigate("/summary");
    }, TIMER_DURATION);

    return () => clearTimeout(timer);

  }, [activityKey, navigate]);
  const handleUserActivity = () => {
    setActivityKey(Date.now());
  };

  return (
    <div>
      {children && React.isValidElement(children) && cloneElement(children, { 
            onTimerReset: handleUserActivity 
      })}
   </div>
  );
}

export default TrashTrigger;

