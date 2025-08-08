import React, { createContext, useContext, useState } from 'react';

const TestSessionContext = createContext();

export const useTestSession = () => useContext(TestSessionContext);

export const TestSessionProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeAllowed, setTimeAllowed] = useState(0);

  const [startTime, setStartTime] = useState(() => {
    const stored = sessionStorage.getItem('startTime');
    return stored ? parseInt(stored) : null;
  });

  const [endTime, setEndTime] = useState(() => {
    const stored = sessionStorage.getItem('endTime');
    return stored ? parseInt(stored) : null;
  });

  const setEndTimeSafe = (val) => {
    setEndTime(val);
    sessionStorage.setItem('endTime', val.toString());
  };

  return (
    <TestSessionContext.Provider
      value={{
        userName,
        setUserName,
        questions,
        setQuestions,
        answers,
        setAnswers,
        timeAllowed,
        setTimeAllowed,
        startTime,
        setStartTime,
        endTime,
        setEndTime: setEndTimeSafe
      }}
    >
      {children}
    </TestSessionContext.Provider>
  );
};
