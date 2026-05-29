const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Load environment variables relative to this directory
require('dotenv').config({ path: path.join(__dirname, '.env') });

const credentialsPath = path.join(__dirname, "credentials.json");
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
let credential;
let serviceAccount;

if (serviceAccountJson) {
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
    credential = admin.credential.cert(serviceAccount);
    console.log('Firebase credential loaded from FIREBASE_SERVICE_ACCOUNT env var');
  } catch (err) {
    console.warn('Invalid FIREBASE_SERVICE_ACCOUNT JSON:', err.message);
  }
}

if (!credential && fs.existsSync(credentialsPath)) {
  try {
    serviceAccount = require(credentialsPath);
    credential = admin.credential.cert(serviceAccount);
    console.log('Firebase credential loaded from server/credentials.json');
  } catch (err) {
    console.warn('Failed to load server/credentials.json:', err.message);
  }
}

if (!credential) {
  credential = admin.credential.applicationDefault();
  console.log('Firebase credential loaded from application default credentials');
}

const appOptions = { credential };
if (serviceAccount?.project_id) {
  appOptions.projectId = serviceAccount.project_id;
}

admin.initializeApp(appOptions);

const db = admin.firestore();
db.settings({ databaseId: process.env.FIREBASE_DATABASE_ID || 'hwprotodb' });
const auth = admin.auth();

let firestoreOk = true;

// Verify Firestore connectivity asynchronously at startup
db.collection('diagnostic_tests').doc('startup_check').get()
  .then(() => {
    console.log('Firestore connection verified successfully.');
  })
  .catch((err) => {
    if (err && (err.code === 5 || err.message?.includes('5 NOT_FOUND') || err.message?.includes('NOT_FOUND') || err.message?.includes('does not exist'))) {
      console.warn('Firestore database is not initialized or does not exist. Falling back to local storage.');
      firestoreOk = false;
    } else {
      console.warn('Firestore initialization check failed:', err.message);
    }
  });

const isFirestoreAvailable = () => firestoreOk;

module.exports = { admin, db, auth, isFirestoreAvailable };
