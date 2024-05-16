import firebase from 'firebase/app';
import 'firebase/firestore';



const firebaseConfig = {
    apiKey: "AIzaSyCvgI9tMwsL-uHf3RrNFFKu3uRWgh0qYmY",
    authDomain: "focustodo-c005d.firebaseapp.com",
    projectId: "focustodo-c005d",
    storageBucket: "focustodo-c005d.appspot.com",
    messagingSenderId: "641987073169",
    appId: "1:641987073169:web:f981bcb76779940005db30",
    measurementId: "G-3ZD6H4DEPG"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
export default app;
