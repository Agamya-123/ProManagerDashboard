const express = require('express');
const router = express.Router();
const db = require('../database');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_in_production';

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.get('SELECT * FROM employees WHERE email = ?', [email]);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Return user info (excluding password) and token
        const { password: _, ...userInfo } = user;
        res.json({
            message: 'Login successful',
            user: userInfo,
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
