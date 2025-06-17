// scripts/firebase-config.js
console.log('firebase-config.js cargado');
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Cargar la configuración de Firebase desde config.json situado en la raíz del
// proyecto. Este archivo no debe versionarse y debe contener los valores reales.
let firebaseConfig;
try {
  const url = new URL('../config.json', import.meta.url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  firebaseConfig = await res.json();
} catch (err) {
  console.error('No se pudo cargar config.json', err);
  throw err;
}

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const provider = new GoogleAuthProvider();

export { app, db, auth, firestore, provider, onAuthStateChanged, signInWithPopup };
