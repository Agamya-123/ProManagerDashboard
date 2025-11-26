const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const employeeRoutes = require('./routes/employees');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', require('./routes/comments'));

app.get('/', (req, res) => {
    res.json({ message: 'Employee & Task Management API is running.' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
