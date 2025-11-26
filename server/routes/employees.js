const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

// GET all employees
router.get('/', async (req, res) => {
    try {
        const rows = await db.all('SELECT * FROM employees');
        res.json({
            message: 'success',
            data: rows
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET single employee
router.get('/:id', async (req, res) => {
    try {
        const row = await db.get('SELECT * FROM employees WHERE id = ?', [req.params.id]);
        res.json({
            message: 'success',
            data: row
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// CREATE new employee
router.post('/', async (req, res) => {
    const { name, email, position, department, salary, password } = req.body;
    // Default password if not provided
    const finalPassword = password || '123456';
    
    try {
        const result = await db.run(
            'INSERT INTO employees (name, email, position, department, salary, password) VALUES (?,?,?,?,?,?)',
            [name, email, position, department, salary, finalPassword]
        );
        res.json({
            message: 'success',
            data: { id: result.lastID, ...req.body, password: finalPassword }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// UPDATE employee
router.put('/:id', async (req, res) => {
    const { name, email, position, department, salary, password, phone } = req.body;
    try {
        const result = await db.run(
            `UPDATE employees SET 
            name = COALESCE(?, name), 
            email = COALESCE(?, email), 
            position = COALESCE(?, position), 
            department = COALESCE(?, department), 
            salary = COALESCE(?, salary),
            password = COALESCE(?, password)
            WHERE id = ?`,
            [name, email, position, department, salary, password, req.params.id]
        );
        res.json({
            message: 'success',
            changes: result.changes
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.run('DELETE FROM employees WHERE id = ?', [req.params.id]);
        res.json({
            message: 'deleted',
            changes: result.changes
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
