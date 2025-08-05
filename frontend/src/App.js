import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import TakeTestPage from './pages/TakeTestPage.js';
import QuestionsPage from './pages/QuestionsPage.js';
import ResultsPage from './pages/ResultsPage.js';
import QuestionPage from './pages/QuestionPage.js';
import FinishedPage from './pages/FinishedPage.js';
import { TestSessionProvider } from './pages/TestSessionContext.js';
import NavbarComponent from './components/NavbarComponent.js';
import WhatisPage from './pages/WhatisPage.js';
import HomePage from './pages/HomePage.js';

function App() {
  return (
    <Router>
      <TestSessionProvider>
        <NavbarComponent></NavbarComponent>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/taketest" element={<TakeTestPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/taketest/question/:index" element={<QuestionPage />} />
          <Route path="/taketest/finished" element={<FinishedPage />} />
          <Route path="/whatis" element={<WhatisPage />} />

        </Routes>
      </TestSessionProvider>

    </Router>
  );
}

export default App;
