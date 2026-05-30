// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// Initialize Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);

