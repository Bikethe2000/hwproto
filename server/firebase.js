const admin = require("firebase-admin");

// Build credential object from environment variables
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const db = admin.firestore();
const auth = admin.auth();

let firestoreOk = true;

// Verify Firestore connectivity
db.collection('diagnostic_tests').doc('startup_check').get()
  .then(() => {
    console.log('Firestore connection verified successfully.');
  })
  .catch((err) => {
    if (
      err.code === 5 ||
      err.message?.includes('NOT_FOUND') ||
      err.message?.includes('does not exist')
    ) {
      console.warn('Firestore database is not initialized or does not exist. Falling back to local storage.');
      firestoreOk = false;
    } else if (
      err.code === 16 ||
      err.message?.toLowerCase().includes('unauthenticated') ||
      err.message?.toLowerCase().includes('invalid authentication') ||
      err.message?.toLowerCase().includes('oauth')
    ) {
      console.warn('Firestore initialization failed due to authentication error. Falling back to local storage.');
      console.warn('Auth error details:', err.message);
      firestoreOk = false;
    } else {
      console.warn('Firestore initialization check failed:', err.message);
    }
  });

const isFirestoreAvailable = () => firestoreOk;

module.exports = { admin, db, auth, isFirestoreAvailable };
