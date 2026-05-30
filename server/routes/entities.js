const express = require("express");
const router = express.Router();
const { db } = require("../firebase");

// List
router.get("/:entity/list", async (req, res) => {
  try {
    const q = await db.collection(req.params.entity).get();
    const results = q.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Filter
router.post("/:entity/filter", async (req, res) => {
  try {
    let col = db.collection(req.params.entity);
    for (const [k, v] of Object.entries(req.body || {})) {
      col = col.where(k, "==", v);
    }
    const q = await col.get();
    const results = q.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create
router.post("/:entity", async (req, res) => {
  try {
    const docRef = await db.collection(req.params.entity).add(req.body);
    res.json({ id: docRef.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put("/:entity/:id", async (req, res) => {
  try {
    await db.collection(req.params.entity).doc(req.params.id).update(req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete("/:entity/:id", async (req, res) => {
  try {
    await db.collection(req.params.entity).doc(req.params.id).delete();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get by ID
router.get("/:entity/:id", async (req, res) => {
  try {
    const doc = await db.collection(req.params.entity).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "not found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
