const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FILE = path.join(__dirname, 'local_entities.json');

const read = () => {
  try {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE, 'utf8') || '{}');
  } catch (e) {
    return {};
  }
};

const write = (data) => {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
};

const list = async (entity) => {
  const store = read();
  return store[entity] || [];
};

const filter = async (entity, filters) => {
  const store = read();
  const list = store[entity] || [];
  return list.filter(item => {
    return Object.entries(filters).every(([key, value]) => item[key] === value);
  });
};

const create = async (entity, data) => {
  const store = read();
  if (!store[entity]) store[entity] = [];
  
  const newItem = {
    id: crypto.randomUUID(),
    ...data,
    created_date: Date.now()
  };
  
  store[entity].push(newItem);
  write(store);
  return newItem;
};

const update = async (entity, id, updates) => {
  const store = read();
  if (!store[entity]) return null;
  const idx = store[entity].findIndex(item => item.id === id);
  if (idx === -1) return null;
  
  store[entity][idx] = { ...store[entity][idx], ...updates };
  write(store);
  return store[entity][idx];
};

const deleteEntity = async (entity, id) => {
  const store = read();
  if (!store[entity]) return false;
  const idx = store[entity].findIndex(item => item.id === id);
  if (idx === -1) return false;
  
  store[entity].splice(idx, 1);
  write(store);
  return true;
};

const get = async (entity, id) => {
  const store = read();
  if (!store[entity]) return null;
  return store[entity].find(item => item.id === id) || null;
};

module.exports = {
  list,
  filter,
  create,
  update,
  delete: deleteEntity,
  get,
};
