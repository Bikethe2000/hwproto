const express = require('express');
const router = express.Router();
const { db, isFirestoreAvailable } = require('../firebase');
const { sendNewAdminEmail } = require('../services/emailService');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const INITIAL_ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL || null;

if (!db) {
  console.warn('Firestore not initialized. Auth routes will return errors until credentials are configured.');
}

const usersCol = () => db.collection('users');
const localStore = require('../localUserStore');

// Helper wrappers that attempt Firestore first and fall back to a local JSON store
const findUserByEmail = async (email) => {
  if (db && isFirestoreAvailable()) {
    try {
      const q = await usersCol().where('email', '==', email).limit(1).get();
      if (q.empty) return null;
      const doc = q.docs[0];
      return { id: doc.id, data: doc.data() };
    } catch (err) {
      if (err && (err.code === 5 || err.message?.includes('5 NOT_FOUND') || err.message?.includes('NOT_FOUND'))) {
        // Firestore not available; fall through to local store
      } else throw err;
    }
  }
  const u = await localStore.findByEmail(email);
  return u ? { id: u.id, data: u } : null;
};

const findUserById = async (id) => {
  if (db && isFirestoreAvailable()) {
    try {
      const q = await usersCol().where('id', '==', id).limit(1).get();
      if (q.empty) return null;
      const doc = q.docs[0];
      return { id: doc.id, data: doc.data() };
    } catch (err) {
      if (err && (err.code === 5 || err.message?.includes('5 NOT_FOUND') || err.message?.includes('NOT_FOUND'))) {
        // Fall through to local store
      } else throw err;
    }
  }
  const u = await localStore.findById(id);
  return u ? { id: u.id, data: u } : null;
};

const createUserRecord = async (user) => {
  if (db && isFirestoreAvailable()) {
    try {
      const id = user.id;
      await usersCol().doc(id).set(user);
      return { id, data: user };
    } catch (err) {
      if (err && (err.code === 5 || err.message?.includes('5 NOT_FOUND') || err.message?.includes('NOT_FOUND'))) {
        // Fall through to local store
      } else throw err;
    }
  }
  await localStore.createUser(user);
  return { id: user.id, data: user };
};

const updateUserRecord = async (id, updates) => {
  if (db && isFirestoreAvailable()) {
    try {
      await usersCol().doc(id).update(updates);
      const q = await usersCol().where('id', '==', id).limit(1).get();
      const doc = q.docs[0];
      return { id: doc.id, data: doc.data() };
    } catch (err) {
      if (err && (err.code === 5 || err.message?.includes('5 NOT_FOUND') || err.message?.includes('NOT_FOUND'))) {
        // Fall through to local store
      } else throw err;
    }
  }
  const u = await localStore.updateUser(id, updates);
  return u ? { id: u.id, data: u } : null;
};

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email & password required' });
  try {
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'user already exists' });
    const id = crypto.randomUUID();
    const hashed = await bcrypt.hash(password, 10);
    const role = INITIAL_ADMIN_EMAIL && INITIAL_ADMIN_EMAIL === email ? 'admin' : 'user';
    const token = jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '7d' });
    const userRecord = { id, email, name: name || '', password: hashed, role, current_jwt: token, created_at: Date.now() };
    await createUserRecord(userRecord);
    res.json({ access_token: token, user: { id, email, name, role } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email & password required' });
  try {
    const found = await findUserByEmail(email);
    if (!found) return res.status(401).json({ error: 'invalid credentials' });
    const data = found.data;
    const ok = await bcrypt.compare(password, data.password || '');
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    const token = jwt.sign({ id: data.id || found.id, email: data.email, role: data.role || 'user' }, JWT_SECRET, { expiresIn: '7d' });
    await updateUserRecord(data.id || found.id, { current_jwt: token });
    res.json({ access_token: token, user: { id: data.id || found.id, email: data.email, name: data.name, role: data.role || 'user' } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', async (req, res) => {
  const token = req.headers['authorization']?.replace('Bearer ', '') || req.query.token;
  if (!token) return res.status(401).json({ error: 'no token' });
  try {
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: 'invalid token' });
    }
    const found = await findUserById(payload.id);
    if (!found) return res.status(404).json({ error: 'user not found' });
    const data = found.data;
    if (data.current_jwt !== token) return res.status(401).json({ error: 'token revoked' });
    res.json({ id: data.id || found.id, email: data.email, name: data.name, role: data.role || 'user' });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', async (req, res) => {
  const token = req.headers['authorization']?.replace('Bearer ', '') || req.body.token || req.query.token;
  if (!token) return res.json({ ok: true });
  try {
    // Try to locate user by current_jwt via Firestore; if not available, check local store
    if (db && isFirestoreAvailable()) {
      try {
        const q = await usersCol().where('current_jwt', '==', token).limit(1).get();
        if (q.empty) return res.json({ ok: true });
        await usersCol().doc(q.docs[0].id).update({ current_jwt: null });
        return res.json({ ok: true });
      } catch (err) {
        if (!(err && (err.code === 5 || err.message?.includes('5 NOT_FOUND') || err.message?.includes('NOT_FOUND')))) throw err;
        // else fallthrough to local
      }
    }
    const u = await localStore.findByCurrentJwt(token);
    if (!u) return res.json({ ok: true });
    await localStore.updateUser(u.id, { current_jwt: null });
    res.json({ ok: true });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Middleware: Verify admin access
const requireAdmin = async (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '') || req.query.token;
  if (!token) return res.status(401).json({ error: 'no token' });
  try {
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: 'invalid token' });
    }
    const found = await findUserById(payload.id);
    if (!found) return res.status(404).json({ error: 'user not found' });
    const data = found.data;
    if (data.current_jwt !== token) return res.status(401).json({ error: 'token revoked' });
    if (data.role !== 'admin') return res.status(403).json({ error: 'admin access required' });
    req.currentUser = { id: data.id || found.id, email: data.email, role: data.role };
    next();
  } catch (err) {
    console.error('Admin check error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new admin user
router.post('/create-admin', requireAdmin, async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });

  try {
    // Check if user already exists
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'user already exists' });

    // Generate temporary password
    const tempPassword = crypto.randomBytes(8).toString('hex').toUpperCase();
    const id = crypto.randomUUID();
    const hashed = await bcrypt.hash(tempPassword, 10);

    const userRecord = {
      id,
      email,
      name: name || '',
      password: hashed,
      role: 'admin',
      created_at: Date.now(),
      created_by: req.currentUser.email,
      temp_password: true,
      current_jwt: null
    };

    await createUserRecord(userRecord);

    // Send welcome email with temporary password
    let emailResult = { success: false, error: null };
    try {
      emailResult = await sendNewAdminEmail({
        email,
        name: name || '',
        tempPassword,
        createdBy: req.currentUser.email
      });
      
      if (emailResult.success) {
        console.log(`Welcome email sent to ${email}`);
      } else {
        console.warn(`Failed to send email to ${email}: ${emailResult.error}`);
      }
    } catch (emailErr) {
      console.error(`Error sending email to ${email}:`, emailErr.message);
      emailResult.error = emailErr.message;
    }

    res.json({
      success: true,
      user: {
        id,
        email,
        name,
        role: 'admin',
        tempPassword
      },
      message: `Admin created. Temporary password: ${tempPassword}`,
      email_sent: emailResult.success,
      email_status: emailResult.error ? `Failed: ${emailResult.error}` : 'Sent successfully',
      email_preview: emailResult.preview || null
    });
  } catch (err) {
    console.error('Create admin error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
