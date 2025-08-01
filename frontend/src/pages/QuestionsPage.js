import React, { useEffect, useState } from 'react';
import { getQuestions, addQuestion, updateQuestions } from '../services/api';
import QuestionCard from '../components/QuestionCard'; 
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/esm/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Pagination from 'react-bootstrap/Pagination';


function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [rightAnswer, setRightAnswer] = useState('');
  const [choices, setChoices] = useState(['', '', '', '']);
  const [imageFile, setImageFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ variant: '', message: '', show: false });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const showAlert = (variant, message) => {
    setAlert({ variant, message, show: true });
    setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await getQuestions();
      setQuestions(res.data);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  const handleAddChoice = () => {
    setChoices([...choices, '']);
  };

  const handleChangeChoice = (index, value) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('question_text', questionText);
    formData.append('right_answer', rightAnswer);
    if (imageFile) formData.append('image', imageFile)
    choices.forEach((choice, index) => {
      formData.append(`choices[${index}]`, choice);
    });

    if (!questionText | !rightAnswer | !imageFile | !choices) {
      showAlert('danger', 'Please fill all fields.');
      return;
    }

    try {
      if (editMode && editId !== null) {
        await updateQuestions(editId, formData);
        showAlert('success', 'Question updated.');


      } else {
        await addQuestion(formData);
        showAlert('success', 'Question added.');

      }
      resetForm();
      fetchQuestions();
    } catch (err) {
      showAlert('danger', 'Error submitting question.');

      console.error(err);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditMode(false);
    setEditId(null);
    setQuestionText('');
    setRightAnswer('');
    setImageFile(null);
    setChoices(['', '', '', '']);
  };

  const handleEdit = (question) => {
    setEditMode(true);
    setEditId(question.id);
    setShowForm(true);
    setQuestionText(question.question_text);
    setRightAnswer(question.right_answer);
    setImageFile(null);
    const extractedChoices = question.choices.map(c => c.choice_text);
    setChoices(extractedChoices);
  };

  const totalPages = Math.ceil(questions.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = questions.slice(indexOfFirst, indexOfLast);

  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="text-center">All Questions</h1>
      <div style={{ position: 'sticky', top: '0', zIndex: 9999 }}>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
            {alert.message}
          </Alert>
        )}
      </div>
      <Button style={{ marginBottom: '20px' }}  onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add New Question'}
      </Button>
      {showForm && (
        <Card className="p-4 mb-4 shadow-sm mt-3">
          <h4 className="mb-4">{editMode ? 'Edit Question' : 'Add New Question'}</h4>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Question Text</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter question"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correct Answer</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter correct answer"
                value={rightAnswer}
                onChange={(e) => setRightAnswer(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image File (optional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </Form.Group>

            <Form.Label>Choices</Form.Label>
            {choices.map((choice, i) => (
              <Form.Group className="mb-2" key={i}>
                <Form.Control
                  type="text"
                  placeholder={`Choice ${String.fromCharCode(65 + i)}`}
                  value={choice}
                  onChange={(e) => handleChangeChoice(i, e.target.value)}
                />
              </Form.Group>
            ))}

            <div className="mb-3">
              <Button variant="outline-secondary" size="sm" onClick={handleAddChoice}>
                + Add Choice
              </Button>
            </div>

            <div className="d-flex gap-2">
              <Button variant="primary" onClick={handleSubmit}>
                {editMode ? 'Update Question' : 'Submit Question'}
              </Button>
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card>
      )}



      <ListGroup>
        {currentItems.map((q) => (
          <ListGroup.Item key={q.id} className="mb-3 p-3">
            <QuestionCard question={q} refresh={fetchQuestions} showAlert={showAlert} />
          </ListGroup.Item>
        ))}
      </ListGroup>

      {totalPages > 1 && (
        <Pagination className="justify-content-center flex-wrap">
          <Pagination.First onClick={() => setCurrentPage(1)} />
          <Pagination.Prev
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          {paginationItems}
          <Pagination.Next
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
        </Pagination>
      )}
    </Container>
  );
}

export default QuestionsPage;
