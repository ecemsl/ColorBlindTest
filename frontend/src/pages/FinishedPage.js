import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitTest } from '../services/api';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/esm/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function FinishedPage() {
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

    const session = JSON.parse(sessionStorage.getItem('testSession'));

    if (!session || session.submitted) {
      setSubmitted(true);
      setResult(session?.latestResult || null);
      return;
    }

    const payload = {
      user_name: session.userName,
      time: session.time,
      num_questions: session.numQuestions,
      answers: session.questions.map((q, i) => ({
        question_id: q.id,
        answer: session.answers[i] || ''
      }))
    };

    submitTest(payload)
      .then((res) => {
        const resultData = {
          correct: res.data.num_correct_answers,
          total: session.numQuestions,
          status: res.data.status,
          user_name: session.userName,
          date: new Date().toLocaleString(),
          time: session.time
        };

        console.log('Response data:', res.data);

        const updatedSession = {
          ...session,
          submitted: true,
          latestResult: resultData
        };

        sessionStorage.setItem('testSession', JSON.stringify(updatedSession));
        setResult(resultData);
        setSubmitted(true);
      })
      .catch((err) => {
        console.error('Error submitting test:', err);
        setSubmitted(true);
      });
  }, []);

  return (
    <Container className="mt-4">
      <Card className="shadow rounded-4 p-4 mx-auto" style={{ maxWidth: '700px' }}>
      <h2>Test Results</h2>
      {result ? (
        <div style={{ maxWidth: '600px', marginTop: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label>Name</label>
              <input value={result.user_name} disabled style={{ width: '100%' }} />
            </div>
            <div>
              <label>Test Date</label>
              <input value={result.date} disabled style={{ width: '100%' }} />
            </div>
            <div>
              <label>Number of Questions</label>
              <input value={result.total} disabled style={{ width: '100%' }} />
            </div>
            <div>
              <label>Status</label>
              <input value={result.status} disabled style={{ width: '100%' }} />
            </div>
            <div>
              <label>Number of Correct Answers</label>
              <input value={result.correct} disabled style={{ width: '100%' }} />
            </div>
            <div>
              <label>Time (in minutes)</label>
              <input value={result.time} disabled style={{ width: '100%' }} />
            </div>
            <div>
              <label>Status</label>
              <ProgressBar now={(result.correct/result.total)*100} />
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <Button onClick={() => navigate('/results')}>See All Results</Button>
          </div>
        </div>
      ) : (
        <p>Submitting your test...</p>
      )}

      </Card>
    </Container>
  );
}

export default FinishedPage;
