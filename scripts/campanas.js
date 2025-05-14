console.log('campanas.js cargado');
import { firestore } from './firebase-config.js';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const coleccionCampanas = collection(firestore, 'campanas');

// Crear nueva campaña
async function guardarCampana(data) {
  const payload = construirPayloadDesdeFormulario(data);
  await addDoc(coleccionCampanas, payload);
}

// Leer todas las campañas
async function cargarCampanas() {
  try {
    const snap = await getDocs(coleccionCampanas);
    const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    console.log('Resultado de cargarCampanas:', arr);
    return arr;
  } catch (err) {
    console.error('Error en cargarCampanas:', err);
    return [];
  }
}

// Leer una campaña
async function obtenerCampana(id) {
  const ref = doc(firestore, 'campanas', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Campaña no encontrada');
  return { id: snap.id, ...snap.data() };
}

// Actualizar campaña existente
async function actualizarCampana(id, data) {
  const ref = doc(firestore, 'campanas', id);
  const payload = construirPayloadDesdeFormulario(data);
  await updateDoc(ref, payload);
}

// Borrar campaña
async function eliminarCampana(id) {
  await deleteDoc(doc(firestore, 'campanas', id));
}

// Asignar agente a campaña
async function asignarAgente(campanaId, agenteId) {
  const assignmentsRef = collection(firestore, 'assignments');
  await addDoc(assignmentsRef, {
    campana_id: campanaId,
    agente_id: agenteId,
    asignado: true,
    timestamp: Date.now()
  });
}

// Desasignar agente de campaña
async function desasignarAgente(campanaId, agenteId) {
  const assignmentsRef = collection(firestore, 'assignments');
  const snap = await getDocs(assignmentsRef);
  for (const docu of snap.docs) {
    const data = docu.data();
    if (data.campana_id === campanaId && data.agente_id === agenteId) {
      await deleteDoc(doc(firestore, 'assignments', docu.id));
    }
  }
}

// Construye el objeto que va a Firestore según tipo
function construirPayloadDesdeFormulario(data) {
  const tipo = (data.tipo || '').toLowerCase();
  const comunes = {
    nombre: data.nombre,
    tipo,
    horarios: data.horarios || [],
    transferencias: data.transferencias || [],
    email: data.email || null
  };

  if (tipo === 'entrante') {
    return {
      ...comunes,
      caller_id: data.caller_id || '',
      estrategia: data.estrategia || '',
      ivr_id: data.ivr_id || '',
      bienvenida_audio: data.bienvenida_audio || '',
      espera_audio: data.espera_audio || '',
      wrap_up_time: Number(data.wrap_up_time) || 0,
      ringing_time: Number(data.ringing_time) || 30,
      dial_timeout: Number(data.dial_timeout) || 45
    };
  }

  if (tipo === 'saliente') {
    return {
      ...comunes,
      caller_id: data.caller_id || '',
      cadena_marcado: data.cadena_marcado || '',
      estrategia: data.estrategia || '',
      reintento: Number(data.reintento) || 3,
      wrap_up_time: Number(data.wrap_up_time) || 0,
      ringing_time: Number(data.ringing_time) || 30,
      dial_timeout: Number(data.dial_timeout) || 45,
      sip_trunk_id: data.sip_trunk_id || ''
    };
  }

  // WhatsApp u otros
  return {
    ...comunes,
    rompehielos: data.rompehielos || [],
    bot_id: data.bot_id || '',
    numero_origen: data.numero_origen || '',
    flujo_asociado: data.flujo_asociado || '',
    proveedor: data.proveedor || ''
  };
}

// Funciones para el UI
window.eliminarCampanaUI = async function(id) {
  if (confirm("¿Eliminar esta campaña?")) {
    await eliminarCampana(id);
    window.mostrarCampanasEnLista();
  }
};
window.actualizarCampanaUI = async function(id) {
  await window.editarCampanaUI(id);
};
window.editarCampanaUI = async function(id) {
  try {
    const c = await obtenerCampana(id);
    console.log('✏️ Editando campaña:', c);
    document.getElementById('nombre').value = c.nombre || '';
    document.getElementById('tipo').value = c.tipo || '';
    document.getElementById('tipo').dispatchEvent(new Event('change'));
    // Rellena otros campos según el tipo de campaña
  } catch (err) {
    console.error('Error al editar campaña:', err);
  }
};

// Renderiza la lista de campañas con botones Editar y Eliminar
async function mostrarCampanasEnLista() {
  console.log('🔄 mostrando campañas…');
  const lista = document.getElementById('lista-campanas');
  if (!lista) {
    console.error('No se encontró el elemento #lista-campanas en el DOM');
    return;
  }
  lista.innerHTML = '';
  try {
    const campanas = await cargarCampanas();
    if (!Array.isArray(campanas)) {
      throw new Error('El resultado de cargarCampanas no es un array.');
    }
    if (campanas.length === 0) {
      lista.innerHTML = '<li class="text-gray-500">No hay campañas registradas.</li>';
      return;
    }
    campanas.forEach(c => {
      const li = document.createElement('li');
      li.className = "flex justify-between items-center border-b py-2";
      li.innerHTML = `
        <div>
          <strong>${c.nombre || '(Sin nombre)'}</strong>
          <span class="text-gray-500">(${c.tipo || '(Sin tipo)'})</span>
          <span class="text-xs text-gray-400 ml-2">ID: ${c.id || ''}</span>
        </div>
        <div>
          <button onclick="editarCampanaUI('${c.id}')" class="text-blue-500 text-sm hover:underline">Editar</button>
          <button onclick="eliminarCampanaUI('${c.id}')" class="text-red-500 text-sm hover:underline">Eliminar</button>
        </div>
      `;
      lista.appendChild(li);
    });
  } catch (err) {
    lista.innerHTML = `<li class="text-red-500">Error al cargar campañas: ${err.message}</li>`;
    console.error('Error en mostrarCampanasEnLista:', err);
  }
}
window.mostrarCampanasEnLista = mostrarCampanasEnLista;

// Exporta todas las funciones solo aquí, al final del archivo
export {
  guardarCampana,
  cargarCampanas,
  obtenerCampana,
  actualizarCampana,
  eliminarCampana,
  asignarAgente,
  desasignarAgente,
  mostrarCampanasEnLista
};
