import express from 'express';
import cors from 'cors';
import { createClient as createDbClient } from '@libsql/client';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const db = createDbClient({
  url: 'file:database.sqlite',
});

// Since the backend needs to verify tokens, it needs the Supabase URL and Anon Key.
// We will read them from environment variables or use placeholders (but verification will fail without real ones).
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Initialize database
async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      name TEXT,
      role TEXT
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS problems (
      id TEXT PRIMARY KEY,
      title TEXT,
      domain TEXT,
      description TEXT,
      requirements TEXT,
      pipeline TEXT,
      expected_outcomes TEXT
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS allocations (
      user_email TEXT PRIMARY KEY,
      problem_id TEXT UNIQUE,
      FOREIGN KEY(user_email) REFERENCES users(email),
      FOREIGN KEY(problem_id) REFERENCES problems(id)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  const checkSettings = await db.execute(`SELECT value FROM settings WHERE key = 'is_released'`);
  if (checkSettings.rows.length === 0) {
    await db.execute({
      sql: `INSERT INTO settings (key, value) VALUES (?, ?)`,
      args: ['is_released', 'false']
    });
  }

  const checkProblems = await db.execute(`SELECT count(*) as count FROM problems`);
  if (checkProblems.rows[0].count === 0) {
    const problemsPath = path.join(__dirname, 'data', 'problems.json');
    if (fs.existsSync(problemsPath)) {
      const problemsData = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));
      for (const p of problemsData) {
        await db.execute({
          sql: `INSERT INTO problems (id, title, domain, description, requirements, pipeline, expected_outcomes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [p.id, p.title, p.domain, p.description, JSON.stringify(p.requirements), p.pipeline, JSON.stringify(p.expected_outcomes)]
        });
      }
    }
  }

  // Seed test users (Removed mock admin/karthik to enforce security per user instruction)
  const testUsers = [
    { email: 'jaisuryav.cs25@bitsathy.ac.in', name: 'Admin User', role: 'ADMIN' },
    // You can add valid leader emails here
  ];
  for (const u of testUsers) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO users (email, name, role) VALUES (?, ?, ?)`,
      args: [u.email, u.name, u.role]
    });
  }
}

initDb().catch(console.error);

// Authentication Middleware
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Securely verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Check if user is in our local DB
    const result = await db.execute({
      sql: `SELECT * FROM users WHERE email = ?`,
      args: [user.email]
    });
    
    if (result.rows.length > 0) {
      req.user = result.rows[0];
      req.userToken = token;
      next();
    } else {
      return res.status(403).json({ error: 'Access restricted. Your account is not authorized for the Hackathon Portal.' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

const requireLeader = (req, res, next) => {
  if (req.user.role === 'LEADER' || req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Leader access required' });
  }
};

// Endpoint to verify token and return user role to frontend
app.post('/api/auth/verify', authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Admin: Get release status
app.get('/api/admin/release-status', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await db.execute(`SELECT value FROM settings WHERE key = 'is_released'`);
    res.json({ is_released: result.rows[0].value === 'true' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update release status
app.post('/api/admin/release', authenticate, requireAdmin, async (req, res) => {
  try {
    await db.execute({
      sql: `UPDATE settings SET value = 'true' WHERE key = 'is_released'`,
      args: []
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get allocations
app.get('/api/admin/allocations', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await db.execute(`
      SELECT a.problem_id, u.name as leader_name, u.email as leader_email
      FROM allocations a
      JOIN users u ON a.user_email = u.email
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leader: Get problems
app.get('/api/leader/problems', authenticate, requireLeader, async (req, res) => {
  try {
    const settings = await db.execute(`SELECT value FROM settings WHERE key = 'is_released'`);
    if (settings.rows[0].value !== 'true') {
      return res.status(403).json({ error: 'Problems not released yet' });
    }
    const problems = await db.execute(`SELECT * FROM problems`);
    const allocations = await db.execute(`SELECT problem_id FROM allocations`);
    const lockedIds = new Set(allocations.rows.map(r => r.problem_id));
    
    const parsedProblems = problems.rows.map(p => ({
      ...p,
      requirements: JSON.parse(p.requirements),
      expected_outcomes: JSON.parse(p.expected_outcomes),
      is_locked: lockedIds.has(p.id)
    }));
    res.json(parsedProblems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leader: Lock problem
app.post('/api/leader/lock', authenticate, requireLeader, async (req, res) => {
  const { problem_id } = req.body;
  // Use securely verified email from req.user
  const user_email = req.user.email;
  try {
    await db.execute({
      sql: `INSERT INTO allocations (user_email, problem_id) VALUES (?, ?)`,
      args: [user_email, problem_id]
    });
    res.json({ success: true });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed: allocations.problem_id')) {
      res.status(400).json({ error: 'Sorry, this problem statement has already been selected by another team.' });
    } else if (err.message.includes('UNIQUE constraint failed: allocations.user_email')) {
      res.status(400).json({ error: 'You have already selected a problem statement.' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Leader: Get my selection
app.get('/api/leader/my-selection', authenticate, requireLeader, async (req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT problem_id FROM allocations WHERE user_email = ?`,
      args: [req.user.email]
    });
    if (result.rows.length > 0) {
      res.json({ problem_id: result.rows[0].problem_id });
    } else {
      res.json({ problem_id: null });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log('Backend server running on http://localhost:3001');
});
