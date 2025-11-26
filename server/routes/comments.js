const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

// GET /api/comments/:taskId
router.get('/:taskId', async (req, res) => {
    const { taskId } = req.params;
    try {
        const sql = `
            SELECT comments.*, employees.name as user_name 
            FROM comments 
            JOIN employees ON comments.user_id = employees.id 
            WHERE task_id = ? 
            ORDER BY created_at DESC
        `;
        const rows = await db.all(sql, [taskId]);
        res.json({ data: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/comments
router.post('/', async (req, res) => {
    const { task_id, user_id, content } = req.body;
    if (!task_id || !user_id || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const result = await db.run(
            'INSERT INTO comments (task_id, user_id, content) VALUES (?,?,?)',
            [task_id, user_id, content]
        );
        res.json({ 
            message: 'Comment added', 
            data: { id: result.lastID, task_id, user_id, content } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
