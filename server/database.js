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
                    
                    // Check if admin exists, if not seed data
                    db.get("SELECT count(*) as count FROM employees", [], (err, row) => {
                        if (err) return console.error(err.message);
                        if (row.count === 0) {
                            console.log('Seeding initial data...');
                            const admin = {
                                name: 'Alice Admin', 
                                email: 'admin@example.com', 
                                password: 'admin123', 
                                role: 'Admin',
                                phone: '123-456-7890', 
                                position: 'System Administrator', 
                                department: 'IT' 
                            };
                            const insert = 'INSERT INTO employees (name, email, password, role, phone, position, department) VALUES (?,?,?,?,?,?,?)';
                            db.run(insert, [admin.name, admin.email, admin.password, admin.role, admin.phone, admin.position, admin.department], (err) => {
                                if (err) console.error('Error seeding admin:', err.message);
                                else console.log('Admin user created.');
                            });
                        }
                    });
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

            // Create Comments Table
            db.run(`CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES employees (id) ON DELETE CASCADE
            )`, (err) => {
                if (err) {
                    console.error('Error creating comments table:', err.message);
                } else {
                    console.log('Comments table ready.');
                }
            });
        });
    }
});

module.exports = db;
