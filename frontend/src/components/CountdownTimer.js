import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTestSession } from '../pages/TestSessionContext';

const CountdownTimer = ({ onTimeUp }) => {
  const { endTime } = useTestSession();
  const [timeLeft, setTimeLeft] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (!endTime) {
      console.log('No endTime found.');
      return;
    }

    console.log('endTime from context:', endTime);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        if (onTimeUp) onTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, location]);

  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        backgroundColor: '#ccccccff',
        color: '#212529',
        fontSize: '18px',
        fontWeight: 600,
        padding: '8px 16px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        display: 'inline-block',
        textAlign: 'center',
        minWidth: '140px'
      }}
    >
      Time Left: {formatTime()}
    </div>
  );
};

export default CountdownTimer;
