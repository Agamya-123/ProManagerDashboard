const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all employees
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM employees ORDER BY created_at DESC';
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

// GET single employee
router.get('/:id', (req, res) => {
    const sql = 'SELECT * FROM employees WHERE id = ?';
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

// CREATE new employee
router.post('/', (req, res) => {
    console.log('Received POST /employees:', req.body); // Debug log
    const { name, email, password, phone, position, department } = req.body;
    const sql = 'INSERT INTO employees (name, email, password, phone, position, department) VALUES (?,?,?,?,?,?)';
    const params = [name, email, password || 'default123', phone, position, department]; // Default password if missing
    console.log('DB Params:', params); // Debug log
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

// UPDATE employee
router.put('/:id', (req, res) => {
    const { name, email, password, phone, position, department } = req.body;
    const sql = `UPDATE employees SET 
                 name = COALESCE(?, name), 
                 email = COALESCE(?, email), 
                 password = COALESCE(?, password),
                 phone = COALESCE(?, phone), 
                 position = COALESCE(?, position), 
                 department = COALESCE(?, department) 
                 WHERE id = ?`;
    const params = [name, email, password, phone, position, department, req.params.id];
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

// DELETE employee
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM employees WHERE id = ?';
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
