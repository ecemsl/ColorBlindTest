const express = require('express');
const router = express.Router();
const { pool } = require('../DB');

// GET /api/results
router.get('/', async (req, res) => {
  try {
    const result = await pool.request()
      .query(`
        SELECT id, user_name, date, time, time_taken, num_questions, num_correct_answers, status
        FROM Tests
        ORDER BY date DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching test results:', err);
    res.status(500).json({ error: 'Failed to retrieve test results' });
  }
});

module.exports = router;
