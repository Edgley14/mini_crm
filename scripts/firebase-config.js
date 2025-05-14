// scripts/firebase-config.js
console.log('firebase-config.js cargado');
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAONqIaSB86VzLW3XIFMcWF9ZOvOUIAxQk",
  authDomain: "crm-mini-af591.firebaseapp.com",
  databaseURL: "https://crm-mini-af591-default-rtdb.firebaseio.com",
  projectId: "crm-mini-af591",
  storageBucket: "crm-mini-af591.appspot.com",
  messagingSenderId: "325270112169",
  appId: "1:325270112169:web:15ccbf690421727f5366b8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const provider = new GoogleAuthProvider();

export { app, db, auth, firestore, provider, onAuthStateChanged, signInWithPopup };
