const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { pool } = require('../DB.js');


const uploadDir = path.join(__dirname, '..', 'public', 'images');
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// GET /api/questions – List all questions with choices
router.get('/', async (req, res) => {
  try {
    const questionsResult = await pool.request()
      .query('SELECT * FROM Questions');

    const questions = questionsResult.recordset;

    for (const question of questions) {
      const choicesResult = await pool.request()
        .input('question_id', question.id)
        .query('SELECT id, choice_text FROM Choices WHERE question_id = @question_id');
      question.choices = choicesResult.recordset;
    }

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching questions' });
  }
});

// POST /api/questions
router.post('/', upload.single('image'), async (req, res) => {
  const { question_text, right_answer } = req.body;
  const choices = Array.isArray(req.body.choices)
    ? req.body.choices
    : Object.values(req.body).filter((v, k) => /^choices\[\d+\]$/.test(Object.keys(req.body)[k]));

  const image_url = req.file ? `/images/${req.file.filename}` : '';

  if (!question_text || !right_answer || choices.length === 0) {
    return res.status(400).json({ error: 'Missing input' });
  }

  try {
    const result = await pool.request()
      .input('question_text', question_text)
      .input('right_answer', right_answer)
      .input('image_url', image_url)
      .query(`
        INSERT INTO Questions (question_text, right_answer, image_url)
        OUTPUT INSERTED.id
        VALUES (@question_text, @right_answer, @image_url)
      `);

    const questionId = result.recordset[0].id;

    for (const choice of choices) {
      await pool.request()
        .input('question_id', questionId)
        .input('choice_text', choice)
        .query('INSERT INTO Choices (question_id, choice_text) VALUES (@question_id, @choice_text)');
    }

    res.status(201).json({ message: 'Question and image saved', questionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save question', details: err.message });
  }
});


router.put('/:id', upload.single('image'), async (req, res) => {
  const questionId = req.params.id;
  const { question_text, right_answer } = req.body;
  const image_url = req.file ? `/images/${req.file.filename}` : null;

  const choices = Array.isArray(req.body.choices)
    ? req.body.choices
    : Object.values(req.body).filter((v, k) => /^choices\[\d+\]$/.test(Object.keys(req.body)[k]));

  if (!question_text || !right_answer || choices.length === 0) {
    return res.status(400).json({ error: 'Missing input' });
  }

  try {
    const query = `
      UPDATE Questions
      SET question_text = @question_text,
          right_answer = @right_answer
          ${image_url ? ', image_url = @image_url' : ''}
      WHERE id = @id
    `;

    const request = pool.request()
      .input('id', questionId)
      .input('question_text', question_text)
      .input('right_answer', right_answer);

    if (image_url) {
      request.input('image_url', image_url);
    }

    await request.query(query);

    await pool.request()
      .input('question_id', questionId)
      .query('DELETE FROM Choices WHERE question_id = @question_id');

    for (const choice of choices) {
      await pool.request()
        .input('question_id', questionId)
        .input('choice_text', choice)
        .query('INSERT INTO Choices (question_id, choice_text) VALUES (@question_id, @choice_text)');
    }

    res.json({ message: 'Question updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update question', details: err.message });
  }
});


// DELETE /api/questions/:id
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid ID' });

  try {
    await pool.request()
      .input('id', id)
      .query('DELETE FROM Questions WHERE id = @id');
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});


module.exports = router;
