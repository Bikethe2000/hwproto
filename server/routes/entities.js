const express = require('express');
const router = express.Router();
const { db, isFirestoreAvailable } = require('../firebase');
const localEntityStore = require('../localEntityStore');

const collection = (name) => db ? db.collection(name) : null;

// Helper to check if an error is a Firestore unavailable/missing db error
const isFirestoreError = (err) => {
  return err && (err.code === 5 || err.message?.includes('5 NOT_FOUND') || err.message?.includes('NOT_FOUND') || err.message?.includes('does not exist'));
};

router.get('/:entity/list', async (req, res) => {
  const { entity } = req.params;
  if (db && isFirestoreAvailable()) {
    try {
      const q = await collection(entity).get();
      const results = q.docs.map(d => ({ id: d.id, ...d.data() }));
      return res.json(results);
    } catch (err) {
      if (!isFirestoreError(err)) {
        console.error(`Firestore list error for ${entity}:`, err);
        return res.status(500).json({ error: err.message });
      }
    }
  }
  try {
    const results = await localEntityStore.list(entity);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:entity/filter', async (req, res) => {
  const { entity } = req.params;
  const filters = req.body || {};
  if (db && isFirestoreAvailable()) {
    try {
      let col = collection(entity);
      Object.entries(filters).forEach(([k, v]) => { col = col.where(k, '==', v); });
      const q = await col.get();
      const results = q.docs.map(d => ({ id: d.id, ...d.data() }));
      return res.json(results);
    } catch (err) {
      if (!isFirestoreError(err)) {
        console.error(`Firestore filter error for ${entity}:`, err);
        return res.status(500).json({ error: err.message });
      }
    }
  }
  try {
    const results = await localEntityStore.filter(entity, filters);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:entity', async (req, res) => {
  const { entity } = req.params;
  const data = req.body || {};
  if (db && isFirestoreAvailable()) {
    try {
      const docRef = await collection(entity).add(data);
      return res.json({ id: docRef.id, ...data });
    } catch (err) {
      if (!isFirestoreError(err)) {
        console.error(`Firestore create error for ${entity}:`, err);
        return res.status(500).json({ error: err.message });
      }
    }
  }
  try {
    const result = await localEntityStore.create(entity, data);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;
  const data = req.body || {};
  if (db && isFirestoreAvailable()) {
    try {
      await collection(entity).doc(id).update(data);
      return res.json({ id, ...data });
    } catch (err) {
      if (!isFirestoreError(err)) {
        console.error(`Firestore update error for ${entity}/${id}:`, err);
        return res.status(500).json({ error: err.message });
      }
    }
  }
  try {
    const result = await localEntityStore.update(entity, id, data);
    if (!result) return res.status(404).json({ error: 'not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;
  if (db && isFirestoreAvailable()) {
    try {
      await collection(entity).doc(id).delete();
      return res.json({ ok: true });
    } catch (err) {
      if (!isFirestoreError(err)) {
        console.error(`Firestore delete error for ${entity}/${id}:`, err);
        return res.status(500).json({ error: err.message });
      }
    }
  }
  try {
    const ok = await localEntityStore.delete(entity, id);
    res.json({ ok });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;
  if (db && isFirestoreAvailable()) {
    try {
      const doc = await collection(entity).doc(id).get();
      if (doc.exists) {
        return res.json({ id: doc.id, ...doc.data() });
      } else {
        return res.status(404).json({ error: 'not found' });
      }
    } catch (err) {
      if (!isFirestoreError(err)) {
        console.error(`Firestore get error for ${entity}/${id}:`, err);
        return res.status(500).json({ error: err.message });
      }
    }
  }
  try {
    const result = await localEntityStore.get(entity, id);
    if (!result) return res.status(404).json({ error: 'not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
