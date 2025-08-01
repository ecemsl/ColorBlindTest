const express = require('express');
const router = express.Router();
const { pool } = require('../DB');

// GET /api/testflow/testquestions/:count
router.get('/testquestions/:count', async (req, res) => {
  const count = parseInt(req.params.count);

  if (!count || count < 1) {
    return res.status(400).json({ error: 'Invalid question count' });
  }

  try {
    const questionsResult = await pool.request()
      .query(`SELECT TOP (${count}) id, question_text, right_answer, image_url FROM Questions ORDER BY NEWID()`);

    const questions = questionsResult.recordset;

    for (const question of questions) {
      const choicesResult = await pool.request()
        .input('question_id', question.id)
        .query('SELECT id, choice_text FROM Choices WHERE question_id = @question_id');

      question.choices = choicesResult.recordset;
    }

    res.status(200).json(questions);
  } catch (err) {
    console.error('Error in /testflow/testquestions:', err);
    res.status(500).json({ error: 'Failed to retrieve test questions' });
  }
});

module.exports = router;
