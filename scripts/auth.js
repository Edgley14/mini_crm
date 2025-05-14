// scripts/auth.js
import { auth, provider, signInWithPopup, onAuthStateChanged } from './firebase-config.js';

export function iniciarSesion(callback) {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      callback(user);
    })
    .catch((error) => {
      console.error("Error en login:", error);
    });
}

export function escucharAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
