import React, { useState } from 'react';
import { updateQuestion, deleteQuestion } from '../services/api';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function QuestionCard({ question, refresh, showAlert }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(question.question_text);
  const [rightAnswer, setRightAnswer] = useState(question.right_answer);
  const [choices, setChoices] = useState(question.choices.map(c => c.choice_text));
  const [imageFile, setImageFile] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('question_text', text);
    formData.append('right_answer', rightAnswer);
    if (imageFile) formData.append('image', imageFile);
    choices.forEach((choice, i) => formData.append(`choices[${i}]`, choice));

    try {
      await updateQuestion(question.id, formData);
      showAlert('success', 'Saved!');
      setIsEditing(false);
      refresh();
    } catch (err) {
      showAlert('danger', 'Failed to update.');
      console.error(err);
    }
  };

  const handleChangeChoice = (index, value) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

  const handleDelete = async () => {
    setShowConfirm(false);

    try {
      await deleteQuestion(question.id);
      showAlert('success', 'Deleted.');
      refresh();
    } catch (err) {
      showAlert('danger', 'Failed to delete.');
      console.error(err);
    }
  };

  return (
    <div style={{
      marginBottom: '20px',
      padding: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '30px'
    }}>
      {/* Left: Display */}
      <div style={{ flex: 1 }}>
        <p><strong>{question.question_text}</strong></p>
        {question.image_url && (
          <img
            src={`http://localhost:3001${question.image_url}`}
            alt="question"
            width={100}
          />
        )}
        <ul>
          {question.choices.map((c, i) => (
            <li key={c.id}><strong>Choice {String.fromCharCode(65 + i)}:</strong> {c.choice_text}</li>
          ))}
        </ul>
        <p><em>Correct Answer: {question.right_answer}</em></p>
        <Container>
          {!isEditing && (
            <div className="d-flex gap-2">
              <Button variant="outline-dark" onClick={() => setIsEditing(true)}>Edit</Button>
              <Button variant="outline-danger" onClick={() => setShowConfirm(true)}>Delete</Button>
            </div>
          )}

          <Modal
            show={showConfirm}
            onHide={() => setShowConfirm(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this question?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Yes, Delete
              </Button>
            </Modal.Footer>
          </Modal>


        </Container>
      </div>

      {/* Right: Editor */}
      {isEditing && (
        <div style={{ flex: 1 }}>
          <Form.Group className="mb-3">
            <Form.Label>Question</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter question text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correct Answer</Form.Label>
            <Form.Control
              type="text"
              placeholder="Correct answer"
              value={rightAnswer}
              onChange={(e) => setRightAnswer(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </Form.Group>

          {choices.map((choice, i) => (
            <Form.Group key={i} className="mb-3">
              <Form.Label>{`Choice ${String.fromCharCode(65 + i)}`}</Form.Label>
              <Form.Control
                type="text"
                value={choice}
                placeholder={`Enter choice ${i + 1}`}
                onChange={(e) => handleChangeChoice(i, e.target.value)}
              />
            </Form.Group>
          ))}
          <Button onClick={handleUpdate} style={{ marginRight: '6px' }}>Save</Button>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>
      )}
    </div>
  );
}

export default QuestionCard;
