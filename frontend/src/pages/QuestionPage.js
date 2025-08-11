import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useTestSession } from './TestSessionContext';
import CountdownTimer from '../components/CountdownTimer';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function QuestionPage() {

  const { index } = useParams();
  const i = parseInt(index);
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ variant: '', message: '', show: false });


  const showAlert = (variant, message) => {
    setAlert({ variant, message, show: true });
    setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 3000);
  };

  const {
    questions,
    answers,
    setAnswers,
    setQuestions,
    setEndTime
  } = useTestSession();



  useEffect(() => {
    const storedSession = JSON.parse(sessionStorage.getItem('testSession'));
    const storedEndTime = storedSession.endTime; //************/

    
    if (!questions.length && storedSession && storedSession.questions && storedSession.answers) {
      setAnswers(storedSession.answers);
      setQuestions(storedSession.questions);
    }

    if (storedEndTime) {
      setEndTime(parseInt(storedEndTime));
    }

    if ((!storedSession || !storedSession.questions || !storedSession.answers) && (!questions.length || !questions[i])) {
      navigate('/taketest');
    }
  }, [questions, i, navigate, setAnswers, setQuestions, setEndTime]);




  const question = questions[i];
  const selected = answers[i] || '';

  const handleSelect = (choiceText) => {
    const updatedAnswers = [...answers];
    updatedAnswers[i] = choiceText;
    setAnswers(updatedAnswers);

    const session = JSON.parse(sessionStorage.getItem('testSession'));
    if (session) {
      session.answers[i] = choiceText;
      sessionStorage.setItem('testSession', JSON.stringify(session));
    }
  };

  const handleNext = () => {
    if (!answers[i]) {
      showAlert('danger', 'Please select an answer.'); return;
    }

    if (i + 1 < questions.length) {
      navigate(`/taketest/question/${i + 1}`);
    } else {
      navigate('/taketest/finished');
    }
  };


  if (!questions.length || !questions[i]) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="mt-4">

      <div style={{ position: 'sticky', top: '0', zIndex: 9999 }}>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
            {alert.message}
          </Alert>
        )}

      </div>

      <Row className="align-items-start justify-content-between mb-3">
        <Col className="text-end">
          <CountdownTimer onTimeUp={() => navigate('/taketest/finished')} />
        </Col>
      </Row>

      <Card className="shadow-sm p-4 mx-auto" style={{ maxWidth: '700px' }}>
        <div className="text-center mb-3">
          <Col>
            <h3>Question {i + 1}</h3>
          </Col>
          <p style={{ fontSize: '1.4rem', fontWeight: '500' }}>{question.question_text}</p>
        </div>

        {question.image_url && (
          <div className="text-center mb-4">
            <img
              src={`http://localhost:3001${question.image_url}`}
              alt="question"
              style={{ maxWidth: '200px', width: '100%' }}
            />
          </div>
        )}

        <Row className="justify-content-center">
          {question.choices.map((c) => (
            <Col key={c.id} xs={12} sm={6} className="mb-3 d-flex justify-content-center">
              <Button
                variant="outline-dark"
                onClick={() => handleSelect(c.choice_text)}
                style={{
                  padding: '10px 20px',
                  minWidth: '100px',
                  width: '80%',
                  backgroundColor: selected === c.choice_text ? '#aaffaa' : 'white',
                  border: '1px solid #ccc',
                }}
              >
                {c.choice_text}
              </Button>
            </Col>
          ))}
        </Row>

        <div className="mt-3 text-end" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <Button onClick={handleNext}>Next</Button>
        </div>
      </Card>

    </Container>
  );
}


export default QuestionPage;
