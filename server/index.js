const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'super_secret_key_for_demo_only'; // In production, use environment variable

// Middleware
app.use(cors());
app.use(express.json());

// Root Route for clear status
app.get('/', (req, res) => {
    res.send('Backend is running properly. Please access the Frontend at http://localhost:5173');
});

// Database Setup
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT DEFAULT 'user',
            email TEXT,
            mobile TEXT,
            used_key_id INTEGER
        )`, (err) => {
            if (!err) {
                // Try to add columns if they don't exist (Simple Migration for dev)
                const columns = ['email', 'mobile', 'used_key_id'];
                columns.forEach(col => {
                    db.run(`ALTER TABLE users ADD COLUMN ${col} TEXT`, () => { });
                });
                // Add is_banned column
                db.run(`ALTER TABLE users ADD COLUMN is_banned INTEGER DEFAULT 0`, () => { });
            }
        });

        // Acceptance Keys Table
        db.run(`CREATE TABLE IF NOT EXISTS acceptance_keys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key_value TEXT UNIQUE,
            is_used INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Messages Table
        db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Seed Admin User
        const adminUsername = 'admin';
        const adminPassword = 'Admin@000';

        db.get("SELECT * FROM users WHERE username = ?", [adminUsername], async (err, row) => {
            if (!row) {
                const hashedPassword = await bcrypt.hash(adminPassword, 10);
                db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
                    [adminUsername, hashedPassword, 'admin'],
                    (err) => {
                        if (err) console.error("Error creating admin:", err);
                        else console.log("Admin user created.");
                    }
                );
            }
        });
    });
}

// Routes

// Login (Admin & User)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        if (user.is_banned) return res.status(403).json({ error: 'Account has been banned' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, role: user.role, username: user.username });
    });
});

// Signup (User only, requires Acceptance Key)
app.post('/api/signup', async (req, res) => {
    const { username, password, acceptanceKey, email, mobile } = req.body;

    if (!acceptanceKey) return res.status(400).json({ error: 'Acceptance key is required' });

    // Validate Acceptance Key
    db.get("SELECT * FROM acceptance_keys WHERE key_value = ? AND is_used = 0", [acceptanceKey], async (err, keyParams) => {
        if (err) return res.status(500).json({ error: 'Database error checking key' });
        if (!keyParams) return res.status(400).json({ error: 'Invalid or used acceptance key' });

        try {
            // Create User
            const hashedPassword = await bcrypt.hash(password, 10);

            db.serialize(() => {
                db.run("BEGIN TRANSACTION");

                // Mark key as used
                db.run("UPDATE acceptance_keys SET is_used = 1 WHERE id = ?", [keyParams.id]);

                // Insert user
                // Storing used_key_id as number, linking to keys table
                db.run("INSERT INTO users (username, password, email, mobile, used_key_id) VALUES (?, ?, ?, ?, ?)",
                    [username, hashedPassword, email, mobile, keyParams.id],
                    function (err) {
                        if (err) {
                            db.run("ROLLBACK");
                            if (err.message.includes('UNIQUE constraint failed')) {
                                return res.status(400).json({ error: 'Username already exists' });
                            }
                            return res.status(500).json({ error: 'Error creating user' });
                        }
                        db.run("COMMIT");
                        res.status(201).json({ message: 'User registered successfully' });
                    });
            });

        } catch (e) {
            res.status(500).json({ error: 'Server error' });
        }
    });

    db.all("SELECT * FROM acceptance_keys ORDER BY created_at DESC", [], (err, rows) => {
        // Just a cleanup in case listener was left, nothing to do here.
    });
});

// Public: Request Acceptance Key (triggered by User)
app.post('/api/request-key', (req, res) => {
    const key = Math.random().toString(36).substring(2, 10).toUpperCase();

    db.run("INSERT INTO acceptance_keys (key_value) VALUES (?)", [key], function (err) {
        if (err) return res.status(500).json({ error: 'Error generating key' });
        res.json({ message: 'Key generated. Please contact admin to retrieve it.' });
    });
});

// Admin: List Keys
app.get('/api/admin/keys', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

    // Join with users table to get details of who used the key
    const query = `
        SELECT 
            ak.*, 
            u.username as used_by_username,
            u.email as used_by_email,
            u.mobile as used_by_mobile
        FROM acceptance_keys ak
        LEFT JOIN users u ON ak.id = u.used_key_id
        ORDER BY ak.created_at DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

// Admin: Get All Users (for banning)
app.get('/api/admin/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

    db.all("SELECT id, username, email, is_banned FROM users WHERE role != 'admin'", [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

// Admin: Ban User
app.post('/api/admin/ban', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    const { userId, isBanned } = req.body;

    db.run("UPDATE users SET is_banned = ? WHERE id = ?", [isBanned ? 1 : 0, userId], function (err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: `User ${isBanned ? 'banned' : 'unbanned'} successfully` });
    });
});

// Admin: Post Update
app.post('/api/admin/updates', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    const { content } = req.body;

    db.run("INSERT INTO messages (content) VALUES (?)", [content], function (err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Update posted successfully' });
    });
});

// Public/User: Get Updates
app.get('/api/updates', (req, res) => {
    db.all("SELECT * FROM messages ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

// Middleware: Authenticate Token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
