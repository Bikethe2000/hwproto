// Client-side Firebase initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCcpig4qTvsHdloCdVNzM3ExY-BvUy6LwI",
  authDomain: "hwproto-8beaf.firebaseapp.com",
  projectId: "hwproto-8beaf",
  storageBucket: "hwproto-8beaf.firebasestorage.app",
  messagingSenderId: "637196792397",
  appId: "1:637196792397:web:f11bf94305dece045ca204",
  measurementId: "G-D582R830ZH"
};

const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    // analytics may not be available in some environments
  }
}

// Firebase Auth (client)
const auth = getAuth(app);

/**
 * Register a new user with email and password using Firebase Auth.
 * Returns the created `user` on success.
 */
export async function register(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logout() {
  return fbSignOut(auth);
}

export function observeAuth(cb) {
  return fbOnAuthStateChanged(auth, cb);
}

export { app, analytics, auth };
