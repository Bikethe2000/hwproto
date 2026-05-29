const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// serve uploads
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
app.use('/uploads', express.static(uploadsPath));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/entities', require('./routes/entities'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/send-email', require('./routes/send-email'));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Firebase args: GOOGLE_APPLICATION_CREDENTIALS=${process.env.GOOGLE_APPLICATION_CREDENTIALS || 'undefined'}, FIREBASE_SERVICE_ACCOUNT=${process.env.FIREBASE_SERVICE_ACCOUNT ? 'set' : 'unset'}`);
});
