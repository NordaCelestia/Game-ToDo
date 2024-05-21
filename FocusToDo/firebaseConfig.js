import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCvgI9tMwsL-uHf3RrNFFKu3uRWgh0qYmY",
  authDomain: "focustodo-c005d.firebaseapp.com",
  projectId: "focustodo-c005d",
  storageBucket: "focustodo-c005d.appspot.com",
  messagingSenderId: "641987073169",
  appId: "1:641987073169:web:f981bcb76779940005db30",
  measurementId: "G-3ZD6H4DEPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
export default app;
