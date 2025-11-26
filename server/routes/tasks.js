const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

// GET all tasks
router.get('/', async (req, res) => {
    try {
        const sql = `SELECT tasks.*, employees.name as assigned_employee_name 
                     FROM tasks 
                     LEFT JOIN employees ON tasks.assigned_to = employees.id 
                     ORDER BY tasks.created_at DESC`;
        const rows = await db.all(sql);
        res.json({
            message: 'success',
            data: rows
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET single task
router.get('/:id', async (req, res) => {
    try {
        const row = await db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
        res.json({
            message: 'success',
            data: row
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// CREATE new task
router.post('/', async (req, res) => {
    const { title, description, status, assigned_to, due_date } = req.body;
    try {
        const result = await db.run(
            'INSERT INTO tasks (title, description, status, assigned_to, due_date) VALUES (?,?,?,?,?)',
            [title, description, status, assigned_to, due_date]
        );
        res.json({
            message: 'success',
            data: { id: result.lastID, ...req.body }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// UPDATE task
router.put('/:id', async (req, res) => {
    const { title, description, status, assigned_to, due_date } = req.body;
    try {
        const result = await db.run(
            `UPDATE tasks SET 
            title = COALESCE(?, title), 
            description = COALESCE(?, description), 
            status = COALESCE(?, status), 
            assigned_to = COALESCE(?, assigned_to), 
            due_date = COALESCE(?, due_date) 
            WHERE id = ?`,
            [title, description, status, assigned_to, due_date, req.params.id]
        );
        res.json({
            message: 'success',
            changes: result.changes
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE task
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.run('DELETE FROM tasks WHERE id = ?', [req.params.id]);
        res.json({
            message: 'deleted',
            changes: result.changes
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
