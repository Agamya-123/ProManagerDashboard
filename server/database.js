const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        db.serialize(() => {
            // Create Employees Table
            db.run(`CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL, -- New: Password for login
                role TEXT DEFAULT 'Employee', -- New: 'Admin' or 'Employee'
                phone TEXT,
                position TEXT NOT NULL,
                department TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) {
                    console.error('Error creating employees table:', err.message);
                } else {
                    console.log('Employees table ready.');
                }
            });

            // Create Tasks Table
            db.run(`CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'Todo', -- Todo, In Progress, Done
                assigned_to INTEGER,
                due_date DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (assigned_to) REFERENCES employees (id) ON DELETE SET NULL
            )`, (err) => {
                if (err) {
                    console.error('Error creating tasks table:', err.message);
                } else {
                    console.log('Tasks table ready.');
                }
            });
        });
    }
});

module.exports = db;
