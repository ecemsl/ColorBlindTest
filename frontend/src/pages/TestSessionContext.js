import React, { createContext, useContext, useState } from 'react';

const TestSessionContext = createContext();

export const useTestSession = () => useContext(TestSessionContext);

export const TestSessionProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeAllowed, setTimeAllowed] = useState(0);
  const [endTime, setEndTime] = useState(() => {
    const stored = sessionStorage.getItem('endTime');
    return stored ? parseInt(stored) : null;
  });

  const initialSubmitted = sessionStorage.getItem('hasSubmitted') === 'true';
  const [hasSubmitted, setHasSubmittedState] = useState(initialSubmitted);

  const setHasSubmitted = (val) => {
    setHasSubmittedState(val);
    sessionStorage.setItem('hasSubmitted', val.toString());
  };

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
        hasSubmitted,
        setHasSubmitted,
        endTime,
        setEndTime: setEndTimeSafe
      }}
    >
      {children}
    </TestSessionContext.Provider>
  );
};
