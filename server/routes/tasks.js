const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all tasks
router.get('/', (req, res) => {
    const sql = `SELECT tasks.*, employees.name as assigned_employee_name 
                 FROM tasks 
                 LEFT JOIN employees ON tasks.assigned_to = employees.id 
                 ORDER BY tasks.created_at DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// GET single task
router.get('/:id', (req, res) => {
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// CREATE new task
router.post('/', (req, res) => {
    const { title, description, status, assigned_to, due_date } = req.body;
    const sql = 'INSERT INTO tasks (title, description, status, assigned_to, due_date) VALUES (?,?,?,?,?)';
    const params = [title, description, status, assigned_to, due_date];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: { id: this.lastID, ...req.body }
        });
    });
});

// UPDATE task
router.put('/:id', (req, res) => {
    const { title, description, status, assigned_to, due_date } = req.body;
    const sql = `UPDATE tasks SET 
                 title = COALESCE(?, title), 
                 description = COALESCE(?, description), 
                 status = COALESCE(?, status), 
                 assigned_to = COALESCE(?, assigned_to), 
                 due_date = COALESCE(?, due_date) 
                 WHERE id = ?`;
    const params = [title, description, status, assigned_to, due_date, req.params.id];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            changes: this.changes
        });
    });
});

// DELETE task
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    const params = [req.params.id];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'deleted',
            changes: this.changes
        });
    });
});

module.exports = router;
