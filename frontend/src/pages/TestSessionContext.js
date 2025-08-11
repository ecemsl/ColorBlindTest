import React, { createContext, useContext, useState } from 'react';

const TestSessionContext = createContext();

export const useTestSession = () => useContext(TestSessionContext);

export const TestSessionProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeAllowed, setTimeAllowed] = useState(0);


  const [startTime, setStartTimeState] = useState(() => {
    const stored = JSON.parse(sessionStorage.getItem('testSession') || '{}');
    return stored.startTime ?? null;
  });

  const [endTime, setEndTimeState] = useState(() => {
    const stored = JSON.parse(sessionStorage.getItem('testSession') || '{}');
    return stored.endTime ?? null;
  });

  const setStartTime = (val) => {
    setStartTimeState(val);
    const session = JSON.parse(sessionStorage.getItem('testSession') || '{}');
    session.startTime = val;
    sessionStorage.setItem('testSession', JSON.stringify(session));
  };

  const setEndTime = (val) => {
    setEndTimeState(val);
    const session = JSON.parse(sessionStorage.getItem('testSession') || '{}');
    session.endTime = val;
    sessionStorage.setItem('testSession', JSON.stringify(session));
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
        setEndTime
      }}
    >
      {children}
    </TestSessionContext.Provider>
  );
};
