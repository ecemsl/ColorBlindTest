import React, { useEffect, useState } from 'react';
import { getQuestions, addQuestion, generateImage } from '../services/api';
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
  const [choices, setChoices] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState({ variant: '', message: '', show: false });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const [genLoading, setGenLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

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


    if (!questionText.trim() || !rightAnswer.trim() || !imageFile) {
      showAlert('danger', 'Please fill all fields.');
      return;
    }

    const nonEmptyChoices = choices.filter(choice => choice.trim() !== '');
    if (nonEmptyChoices.length === 0) {
      showAlert('danger', 'Please add at least one non-empty choice.');
      return;
    }

    if (!nonEmptyChoices.includes(rightAnswer.trim())) {
      showAlert('danger', 'Correct answer must match one of the choices.');
      return;
    }



    const formData = new FormData();
    formData.append('question_text', questionText);
    formData.append('right_answer', rightAnswer);
    if (imageFile) formData.append('image', imageFile)
    nonEmptyChoices.forEach((choice, index) => {
      formData.append(`choices[${index}]`, choice);
    });

    try {
      await addQuestion(formData);
      showAlert('success', 'Question added.');
      resetForm();
      fetchQuestions();
    } catch (err) {
      showAlert('danger', 'Error submitting question.');
      console.error(err);
    }
  };

  const handleGenerateImage = async () => {
    try {
      setGenLoading(true);

      const res = await generateImage(); // POST /api/images/generate
      const { imageBase64, format } = res.data;

      // base64 → Blob → File
      const ext = `image/${format || 'png'}`;
      const imageContent = atob(imageBase64);
      const buffer = new ArrayBuffer(imageContent.length);
      const view = new Uint8Array(buffer);
      for (let n = 0; n < imageContent.length; n++) view[n] = imageContent.charCodeAt(n);
      const blob = new Blob([buffer], { type: ext }); 
      const file = new File([blob], `generated.${format || 'png'}`, { type: ext });

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // creates a string containing a blob URL
      showAlert('success', 'Image generated and attached.');
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.details || 'Image generation failed.';
      showAlert('danger', msg);
    } finally {
      setGenLoading(false);
    }
  };


  const resetForm = () => {
    setShowForm(false);
    setEditMode(false);
    setQuestionText('');
    setRightAnswer('');
    setImageFile(null);
    setChoices([]);
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
      {questions.length === 0 ? (<p>No questions found.</p>) : (
        <>
          <div style={{ position: 'sticky', top: '0', zIndex: 9999 }}>
            {alert.show && (
              <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                {alert.message}
              </Alert>
            )}
          </div>
          <Button style={{ marginBottom: '20px' }} onClick={() => setShowForm(!showForm)}>
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

                <Button className="mb-3" onClick={handleGenerateImage} disabled={genLoading}>  {genLoading ? 'Generating…' : 'Generate Image'}</Button>
                {imagePreview && (
                  <div className="mb-3">
                    <img
                      src={imagePreview}
                      alt="Generated preview"
                      style={{ maxWidth: 240, borderRadius: 8, display: 'block' }}
                    />
                  </div>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Image File</Form.Label>
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
        </>
      )}


    </Container>
  );
}

export default QuestionsPage;
