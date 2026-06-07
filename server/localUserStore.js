const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'local_users.json');

const read = () => {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, 'utf8') || '[]');
  } catch (e) {
    return [];
  }
};

const write = (data) => {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
};

const findByEmail = async (email) => {
  const users = read();
  return users.find(u => u.email === email) || null;
};

const findById = async (id) => {
  const users = read();
  return users.find(u => u.id === id) || null;
};

const findByCurrentJwt = async (token) => {
  const users = read();
  return users.find(u => u.current_jwt === token) || null;
};

const createUser = async (user) => {
  const users = read();
  users.push(user);
  write(users);
  return user;
};

const updateUser = async (id, updates) => {
  const users = read();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  write(users);
  return users[idx];
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  updateUser,
  findByCurrentJwt,
};
