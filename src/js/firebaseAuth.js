// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLdmkBJCVxy9quJCIon1uE2wfCf59zTGo",
  authDomain: "todoapp-da79d.firebaseapp.com",
  databaseURL: "https://todoapp-da79d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "todoapp-da79d",
  storageBucket: "todoapp-da79d.firebasestorage.app",
  messagingSenderId: "586995521004",
  appId: "1:586995521004:web:d56760d60e03b7714edcc9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, googleProvider, signInWithPopup, app };
