import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3001/api',  // backend server
});


export const getQuestions = () => API.get('/questions');

export const addQuestion = (formData) =>
    API.post('/questions', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

export const updateQuestion = (id, formData) =>
    API.put(`/questions/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

export const deleteQuestion = (id) =>
    API.delete(`/questions/${id}`)

export const getResults = () => API.get('/results');

export const getTestQuestions = (count) => API.get(`/testflow/testquestions/${count}`);

export const submitTest = (testData) => API.post('/tests', testData);
