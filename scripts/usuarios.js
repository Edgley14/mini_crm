// scripts/usuarios.js
import { firestore } from './firebase-config.js';
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const usuariosRef = collection(firestore, 'usuarios');

export async function obtenerUsuarios() {
  const snapshot = await getDocs(usuariosRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function actualizarRol(id, nuevoRol) {
  const usuarioDoc = doc(firestore, 'usuarios', id);
  await updateDoc(usuarioDoc, { rol: nuevoRol });
  alert('Rol actualizado');
}
