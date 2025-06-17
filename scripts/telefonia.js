// scripts/telefonia.js
import { firestore } from '../scripts/firebase-config.js';
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const extensionesRef = collection(firestore, 'extensiones');
const ivrRef = collection(firestore, 'ivr');
// Use a unified collection name for SIP trunks to match security rules
const sipTrunksRef = collection(firestore, 'sip_trunks');

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

// Create a new SIP trunk
export async function crearSipTrunk(data) {
  return await addDoc(sipTrunksRef, data);
}

// Retrieve all SIP trunks
export async function obtenerSipTrunks() {
  const snapshot = await getDocs(sipTrunksRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Backwards compatibility aliases
export const crearTroncal = crearSipTrunk;
export const obtenerTroncales = obtenerSipTrunks;
