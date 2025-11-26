const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/comments/:taskId
router.get('/:taskId', (req, res) => {
    const { taskId } = req.params;
    const sql = `
        SELECT comments.*, employees.name as user_name 
        FROM comments 
        JOIN employees ON comments.user_id = employees.id 
        WHERE task_id = ? 
        ORDER BY created_at DESC
    `;
    db.all(sql, [taskId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// POST /api/comments
router.post('/', (req, res) => {
    const { task_id, user_id, content } = req.body;
    if (!task_id || !user_id || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const sql = 'INSERT INTO comments (task_id, user_id, content) VALUES (?,?,?)';
    db.run(sql, [task_id, user_id, content], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ 
            message: 'Comment added', 
            data: { id: this.lastID, task_id, user_id, content } 
        });
    });
});

module.exports = router;
