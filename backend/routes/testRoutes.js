const express = require('express');
const router = express.Router();
const { pool } = require('../DB');

// POST /api/tests to insert test records to database
router.post('/', async (req, res) => {
    const { user_name, time, num_questions, time_taken, answers } = req.body;

    if (!user_name || !time || !num_questions ||!time_taken || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ error: 'Invalid or missing test data' });
    }

    try {
        const date = new Date();
        let num_correct_answers = 0;

        for (const answer of answers) {
            const result = await pool.request()
                .input('id', answer.question_id)
                .query('SELECT right_answer FROM Questions WHERE id = @id');

            const correctAnswer = result.recordset[0]?.right_answer;
            if (answer.answer?.trim().toLowerCase() === correctAnswer?.trim().toLowerCase()) {
                num_correct_answers++;
            }
        }

        let status = 'Poor';
        const accuracy = num_correct_answers / num_questions;
        if (accuracy >= 0.8) status = 'Normal';
        else if (accuracy >= 0.5) status = 'Suspicious';

        const testInsert = await pool.request()
            .input('user_name', user_name)
            .input('date', date)
            .input('time', time)
            .input('time_taken', time_taken)
            .input('num_questions', num_questions)
            .input('num_correct_answers', num_correct_answers)
            .input('status', status)
            .query(`
        INSERT INTO Tests (user_name, date, time, time_taken, num_questions, num_correct_answers, status)
        OUTPUT INSERTED.id
        VALUES (@user_name, @date, @time, @time_taken, @num_questions, @num_correct_answers, @status)
      `);

        const testId = testInsert.recordset[0].id;

        for (const a of answers) {
            await pool.request()
                .input('test_id', testId)
                .input('question_id', a.question_id)
                .input('answer_text', a.answer)
                .query(`
          INSERT INTO UserAnswers (test_id, question_id, answer_text)
          VALUES (@test_id, @question_id, @answer_text)
        `);
        }

        res.status(201).json({
            message: 'Test submitted successfully',
            testId,
            num_correct_answers,
            status
        });
    } catch (err) {
        console.error('Error in POST /api/tests:', err);
        res.status(500).json({ error: 'Failed to submit test', details: err.message });
    }
});

module.exports = router;
