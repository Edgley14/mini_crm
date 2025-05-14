// scripts/telefonia.js
import { firestore } from '../scripts/firebase-config.js';
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const extensionesRef = collection(firestore, 'extensiones');
const ivrRef = collection(firestore, 'ivr');
const troncalesRef = collection(firestore, 'troncales');

export async function crearExtension(data) {
  return await addDoc(extensionesRef, data);
}

export async function obtenerExtensiones() {
  const snapshot = await getDocs(extensionesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function crearIVR(data) {
  return await addDoc(ivrRef, data);
}

export async function obtenerIVRs() {
  const snapshot = await getDocs(ivrRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function crearTroncal(data) {
  return await addDoc(troncalesRef, data);
}

export async function obtenerTroncales() {
  const snapshot = await getDocs(troncalesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
