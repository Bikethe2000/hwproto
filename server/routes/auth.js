const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendNewAdminEmail } = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";
const INITIAL_ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL || null;

const usersCol = () => db.collection("users");

// Helpers
const findUserByEmail = async (email) => {
  const q = await usersCol().where("email", "==", email).limit(1).get();
  if (q.empty) return null;
  const doc = q.docs[0];
  return { id: doc.id, data: doc.data() };
};

const findUserById = async (id) => {
  const doc = await usersCol().doc(id).get();
  return doc.exists ? { id: doc.id, data: doc.data() } : null;
};

const createUserRecord = async (user) => {
  await usersCol().doc(user.id).set(user);
  return { id: user.id, data: user };
};

const updateUserRecord = async (id, updates) => {
  await usersCol().doc(id).update(updates);
  const doc = await usersCol().doc(id).get();
  return { id: doc.id, data: doc.data() };
};

// Register
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email & password required" });

  try {
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: "user already exists" });

    const id = crypto.randomUUID();
    const hashed = await bcrypt.hash(password, 10);
    const role = INITIAL_ADMIN_EMAIL === email ? "admin" : "user";

    const token = jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: "7d" });

    const userRecord = {
      id,
      email,
      name: name || "",
      password: hashed,
      role,
      current_jwt: token,
      created_at: Date.now(),
    };

    await createUserRecord(userRecord);

    res.json({ access_token: token, user: { id, email, name, role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email & password required" });

  try {
    const found = await findUserByEmail(email);
    if (!found) return res.status(401).json({ error: "invalid credentials" });

    const data = found.data;
    const ok = await bcrypt.compare(password, data.password || "");
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    const token = jwt.sign(
      { id: found.id, email: data.email, role: data.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    await updateUserRecord(found.id, { current_jwt: token });

    res.json({
      access_token: token,
      user: { id: found.id, email: data.email, name: data.name, role: data.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Me
router.get("/me", async (req, res) => {
  const token =
    req.headers["authorization"]?.replace("Bearer ", "") || req.query.token;

  if (!token) return res.status(401).json({ error: "no token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const found = await findUserById(payload.id);

    if (!found) return res.status(404).json({ error: "user not found" });
    if (found.data.current_jwt !== token)
      return res.status(401).json({ error: "token revoked" });

    res.json({
      id: found.id,
      email: found.data.email,
      name: found.data.name,
      role: found.data.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
router.post("/logout", async (req, res) => {
  const token =
    req.headers["authorization"]?.replace("Bearer ", "") ||
    req.body.token ||
    req.query.token;

  if (!token) return res.json({ ok: true });

  try {
    const q = await usersCol().where("current_jwt", "==", token).limit(1).get();
    if (!q.empty) {
      await usersCol().doc(q.docs[0].id).update({ current_jwt: null });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin middleware
const requireAdmin = async (req, res, next) => {
  const token =
    req.headers["authorization"]?.replace("Bearer ", "") || req.query.token;

  if (!token) return res.status(401).json({ error: "no token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const found = await findUserById(payload.id);

    if (!found) return res.status(404).json({ error: "user not found" });
    if (found.data.current_jwt !== token)
      return res.status(401).json({ error: "token revoked" });
    if (found.data.role !== "admin")
      return res.status(403).json({ error: "admin access required" });

    req.currentUser = found.data;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create admin
router.post("/create-admin", requireAdmin, async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: "email required" });

  try {
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: "user already exists" });

    const tempPassword = crypto.randomBytes(8).toString("hex").toUpperCase();
    const id = crypto.randomUUID();
    const hashed = await bcrypt.hash(tempPassword, 10);

    const userRecord = {
      id,
      email,
      name: name || "",
      password: hashed,
      role: "admin",
      created_at: Date.now(),
      created_by: req.currentUser.email,
      temp_password: true,
      current_jwt: null,
    };

    await createUserRecord(userRecord);

    await sendNewAdminEmail({
      email,
      name,
      tempPassword,
      createdBy: req.currentUser.email,
    });

    res.json({
      success: true,
      user: { id, email, name, role: "admin", tempPassword },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
