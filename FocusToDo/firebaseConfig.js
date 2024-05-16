// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

import { getFirestore } from "firebase/firestore";



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
const auth = initializeAuth(app);
  const db = getFirestore(app);
 
  
  export { app, auth, db}; 
  export default app;