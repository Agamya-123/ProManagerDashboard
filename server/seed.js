const db = require('./database');

const employees = [
    { 
        name: 'Alice Admin', 
        email: 'admin@example.com', 
        password: 'admin123', // In a real app, hash this!
        role: 'Admin',
        phone: '123-456-7890', 
        position: 'System Administrator', 
        department: 'IT' 
    },
    { 
        name: 'Bob Builder', 
        email: 'bob@example.com', 
        password: 'user123',
        role: 'Employee',
        phone: '987-654-3210', 
        position: 'Software Engineer', 
        department: 'Engineering' 
    },
    { 
        name: 'Charlie Designer', 
        email: 'charlie@example.com', 
        password: 'user123',
        role: 'Employee',
        phone: '555-555-5555', 
        position: 'UI/UX Designer', 
        department: 'Design' 
    }
];

const tasks = [
    { title: 'Fix Login Bug', description: 'Investigate and fix the login issue.', status: 'Todo', assigned_to: 2, due_date: '2023-12-31' },
    { title: 'Design Dashboard', description: 'Create high-fidelity mockups.', status: 'In Progress', assigned_to: 3, due_date: '2023-11-30' },
    { title: 'Write API Documentation', description: 'Document all API endpoints.', status: 'Done', assigned_to: 2, due_date: '2023-10-15' }
];

setTimeout(() => {
    db.serialize(() => {
        // Seed Employees
        const empStmt = db.prepare('INSERT INTO employees (name, email, password, role, phone, position, department) VALUES (?,?,?,?,?,?,?)');
        employees.forEach(emp => {
            empStmt.run(emp.name, emp.email, emp.password, emp.role, emp.phone, emp.position, emp.department, (err) => {
                if (err) {
                    console.error('Error seeding employee:', err.message);
                } else {
                    console.log(`Seeded employee: ${emp.name} (${emp.role})`);
                }
            });
        });
        empStmt.finalize();

        // Seed Tasks
        const taskStmt = db.prepare('INSERT INTO tasks (title, description, status, assigned_to, due_date) VALUES (?,?,?,?,?)');
        tasks.forEach(task => {
            taskStmt.run(task.title, task.description, task.status, task.assigned_to, task.due_date, (err) => {
                if (err) {
                    console.error('Error seeding task:', err.message);
                } else {
                    console.log(`Seeded task: ${task.title}`);
                }
            });
        });
        taskStmt.finalize();
    });
}, 1000);
