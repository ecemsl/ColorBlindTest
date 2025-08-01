import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTestQuestions } from '../services/api';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { useTestSession } from './TestSessionContext';

function TakeTestPage() {
  const [userName, setUserName] = useState('');
  const [numQuestions, setNumQuestions] = useState('');
  const [time, setTime] = useState('');
  const [alert, setAlert] = useState({ variant: '', message: '', show: false });
  const navigate = useNavigate();

  const {
    setUserName: setCtxUserName,
    setQuestions,
    setAnswers,
    setTimeAllowed,
    setEndTime,
    setHasSubmitted,
  } = useTestSession();

  const showAlert = (variant, message) => {
    setAlert({ variant, message, show: true });
    setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    sessionStorage.removeItem('testSession');
    sessionStorage.removeItem('hasSubmitted');
    sessionStorage.removeItem('endTime');
    setHasSubmitted(false);
  }, []);

  const handleStartTest = async () => {
    if (!userName | !numQuestions | !time) {
      showAlert('danger', 'Please fill all fields.');
      return;
    }


    try {
      const res = await getTestQuestions(numQuestions);
      const questions = res.data;

      const now = new Date().getTime();
      const endTime = now + parseInt(time) * 60 * 1000;

      setCtxUserName(userName);
      setQuestions(questions);
      setAnswers(new Array(questions.length).fill(''));
      setTimeAllowed(parseInt(time));
      setEndTime(endTime);

      const sessionData = {
        userName,
        numQuestions: questions.length,
        time: parseInt(time),
        endTime,
        questions,
        answers: [],
      };
      sessionStorage.setItem('testSession', JSON.stringify(sessionData));
      sessionStorage.setItem('endTime', endTime.toString());
      navigate('/taketest/question/0');

    } catch (err) {
      console.error('Failed to fetch questions:', err);
      showAlert('danger', 'Could not start test.');
    }
  };

  return (
    <Container className="mt-4">


      {alert.show && (
        <Alert
        variant={alert.variant}
        onClose={() => setAlert({ ...alert, show: false })}
        dismissible
        >
          {alert.message}
        </Alert>
      )}
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="p-4 rounded-4  shadow" style={{ backgroundColor: 'white', width: '100%', maxWidth: '1000px' }}>

      <h2 style={{textAlign: "center"}}>Start Color Blind Test</h2>
          <Form>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your name here"
                value={userName}
                onChange={e => setUserName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formNumQuestions">
              <Form.Label>Number of Questions</Form.Label>
              <Form.Control
                type="number"
                placeholder="e.g., 10"
                value={numQuestions}
                onChange={e => setNumQuestions(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTimeAllowed">
              <Form.Label>Time Allowed (minutes)</Form.Label>
              <Form.Control
                type="number"
                placeholder="e.g., 5"
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </Form.Group>

            <Button onClick={handleStartTest}>
              Start Test
            </Button>
          </Form>
        </div>
      </div>

    </Container>
  );
}

export default TakeTestPage;
