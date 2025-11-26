const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

const isPostgres = !!process.env.DATABASE_URL;

let db;

if (isPostgres) {
    db = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    console.log('Connected to PostgreSQL database.');
} else {
    const dbPath = path.resolve(__dirname, 'database.sqlite');
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database ' + dbPath + ': ' + err.message);
        } else {
            console.log('Connected to the SQLite database.');
            initializeSqlite();
        }
    });
}

// Helper to convert SQLite '?' to Postgres '$1, $2...'
const convertQuery = (sql) => {
    if (!isPostgres) return sql;
    let i = 1;
    return sql.replace(/\?/g, () => `$${i++}`);
};

const database = {
    query: async (sql, params = []) => {
        if (isPostgres) {
            const res = await db.query(convertQuery(sql), params);
            return res;
        } else {
            return new Promise((resolve, reject) => {
                db.all(sql, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve({ rows });
                });
            });
        }
    },
    
    // For SELECT single row
    get: async (sql, params = []) => {
        if (isPostgres) {
            const res = await db.query(convertQuery(sql), params);
            return res.rows[0];
        } else {
            return new Promise((resolve, reject) => {
                db.get(sql, params, (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
        }
    },

    // For SELECT all rows
    all: async (sql, params = []) => {
        if (isPostgres) {
            const res = await db.query(convertQuery(sql), params);
            return res.rows;
        } else {
            return new Promise((resolve, reject) => {
                db.all(sql, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }
    },

    // For INSERT/UPDATE/DELETE
    run: async (sql, params = []) => {
        if (isPostgres) {
            let query = convertQuery(sql);
            // If it's an INSERT and doesn't have RETURNING, append it to get the ID
            if (query.trim().toUpperCase().startsWith('INSERT') && !query.toUpperCase().includes('RETURNING')) {
                query += ' RETURNING id';
            }
            const res = await db.query(query, params);
            return { lastID: res.rows[0]?.id, changes: res.rowCount };
        } else {
            return new Promise((resolve, reject) => {
                db.run(sql, params, function (err) {
                    if (err) reject(err);
                    else resolve({ lastID: this.lastID, changes: this.changes });
                });
            });
        }
    }
};

function initializeSqlite() {
    db.serialize(() => {
        // Create Employees Table
        db.run(`CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            position TEXT,
            department TEXT,
            salary REAL,
            role TEXT DEFAULT 'Employee',
            password TEXT DEFAULT '123456'
        )`);

        // Create Tasks Table
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'Todo',
            assigned_to INTEGER,
            due_date DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (assigned_to) REFERENCES employees (id) ON DELETE SET NULL
        )`);

        // Create Comments Table
        db.run(`CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES employees (id) ON DELETE CASCADE
        )`);

        // Seed Admin if empty
        db.get("SELECT count(*) as count FROM employees", [], (err, row) => {
            if (err) return console.error(err.message);
            if (row.count === 0) {
                console.log("Seeding Admin user...");
                db.run(`INSERT INTO employees (name, email, position, department, salary, role, password) 
                        VALUES ('Admin User', 'admin@example.com', 'Administrator', 'Management', 0, 'Admin', 'admin123')`);
            }
        });
    });
}

// Initialize Postgres Tables (Async)
if (isPostgres) {
    (async () => {
        try {
            await db.query(`CREATE TABLE IF NOT EXISTS employees (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                position TEXT,
                department TEXT,
                salary REAL,
                role TEXT DEFAULT 'Employee',
                password TEXT DEFAULT '123456'
            )`);

            await db.query(`CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'Todo',
                assigned_to INTEGER REFERENCES employees(id) ON DELETE SET NULL,
                due_date TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

            await db.query(`CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

            const res = await db.query("SELECT count(*) as count FROM employees");
            if (parseInt(res.rows[0].count) === 0) {
                console.log("Seeding Admin user (PG)...");
                await db.query(`INSERT INTO employees (name, email, position, department, salary, role, password) 
                        VALUES ('Admin User', 'admin@example.com', 'Administrator', 'Management', 0, 'Admin', 'admin123')`);
            }
        } catch (err) {
            console.error("Error initializing Postgres:", err);
        }
    })();
}

module.exports = database;
