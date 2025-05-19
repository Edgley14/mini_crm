// campanas-ui.js
import {
  guardarCampana,
  cargarCampanas,
  mostrarCampanasEnLista, // Usaremos esta función importada
  obtenerCampana,
  actualizarCampana,
  eliminarCampana
} from './campanas.js';
import { firestore } from './firebase-config.js';
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

let editId = null;

// --- Selects dinámicos ---
async function cargarSelect(id, coleccionName, campoNombre='nombre') {
  const sel = document.getElementById(id);
  if (!sel) return;
  sel.innerHTML = `<option value="">Seleccionar</option>`;
  const snap = await getDocs(collection(firestore, coleccionName));
  snap.forEach(doc => {
    const data = doc.data();
    const opt = document.createElement('option');
    opt.value = doc.id;
    opt.textContent = data[campoNombre] || doc.id;
    sel.append(opt);
  });
}

// --- Rompehielos UI ---
const rompehielosSelec = [];
window.handleAgregarRompehielos = () => {
  const input = document.getElementById('nuevo-rompehielo');
  const texto = input.value.trim();
  if (!texto) return;
  rompehielosSelec.push(texto);
  input.value = '';
  renderRompehielosList();
};
function renderRompehielosList() {
  const cont = document.getElementById('rompehielos-list');
  cont.innerHTML = '';
  rompehielosSelec.forEach((t, i) => {
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center bg-gray-100 p-2 rounded';
    div.innerHTML = `
      <span class="flex-1">${t}</span>
      <button class="text-red-600 text-xs" onclick="handleEliminarRompehielos(${i})">Eliminar</button>
    `;
    cont.appendChild(div);
  });
}
window.handleEliminarRompehielos = index => {
  rompehielosSelec.splice(index, 1);
  renderRompehielosList();
};

// --- Guardar campaña (nuevo o edición) ---
async function handleGuardarCampana() {
  const tipo = document.getElementById('tipo').value;
  const nombre = document.getElementById('nombre').value.trim();
  const transferencias = document.getElementById('transferencias').value
    .split(',').map(x => x.trim()).filter(x => x);

  const bloques = [...document.querySelectorAll('#bloques-horario > div')].map(div => {
    const dias = [...div.querySelectorAll('input[type=checkbox]')]
      .filter(cb => cb.checked).map(cb => cb.value);
    const tiempos = div.querySelectorAll('input[type=time]');
    return { dias, desde: tiempos[0].value, hasta: tiempos[1].value };
  });

  const comunes = { nombre, tipo, horarios: bloques, transferencias };
  let data;
  if (tipo === 'Entrante') {
    data = {
      ...comunes,
      email:            document.getElementById('email').value,
      caller_id:        document.getElementById('caller_id').value,
      estrategia:       document.getElementById('estrategia').value,
      ivr_id:           document.getElementById('ivr_asociado').value,
      bienvenida_audio: document.getElementById('bienvenida_audio').value,
      espera_audio:     document.getElementById('espera_audio').value,
      wrap_up_time:     +document.getElementById('wrap_up').value,
      ringing_time:     +document.getElementById('ringing').value,
      dial_timeout:     +document.getElementById('timeout').value,
    };
  } else if (tipo === 'Saliente') {
    data = {
      ...comunes,
      email:            document.getElementById('email2').value,
      caller_id:        document.getElementById('caller_id2').value,
      estrategia:       document.getElementById('estrategia2').value,
      cadena_marcado:   document.getElementById('cadena_marcado').value,
      reintento:        +document.getElementById('reintento').value,
      wrap_up_time:     +document.getElementById('wrap_up').value,
      ringing_time:     +document.getElementById('ringing').value,
      dial_timeout:     +document.getElementById('timeout').value,
      sip_trunk_id:     document.getElementById('sip_trunk_select').value
    };
  } else /* WhatsApp */ {
    data = {
      ...comunes,
      rompehielos: [...rompehielosSelec],
      bot_id: document.getElementById('bot_asociado').value,
      numero_origen: document.getElementById('numero_origen').value,
      flujo_asociado: document.getElementById('flujo_asociado_wh').value,
      proveedor: document.getElementById('proveedor_whatsapp').value
    };
  }

  if (editId) {
    await actualizarCampana(editId, data);
    editId = null;
  } else {
    await guardarCampana(data);
  }

  alert('✅ Campaña guardada');
  clearForm();
  mostrarCampanasEnLista();
}

// --- Editar campaña ---
async function editarCampanaUI(id) {
  try {
    const c = await obtenerCampana(id);
    editId = id; // Guardamos el ID de la campaña en edición
    document.getElementById('nombre').value = c.nombre || '';
    document.getElementById('tipo').value = c.tipo || '';
    document.getElementById('tipo').dispatchEvent(new Event('change')); // Actualiza los campos según el tipo

    if (c.tipo === 'entrante') {
      document.getElementById('email').value = c.email || '';
      document.getElementById('caller_id').value = c.caller_id || '';
      document.getElementById('estrategia').value = c.estrategia || '';
      document.getElementById('ivr_asociado').value = c.ivr_id || '';
      document.getElementById('bienvenida_audio').value = c.bienvenida_audio || '';
      document.getElementById('espera_audio').value = c.espera_audio || '';
      document.getElementById('wrap_up').value = c.wrap_up_time || '';
      document.getElementById('ringing').value = c.ringing_time || '';
      document.getElementById('timeout').value = c.dial_timeout || '';
    } else if (c.tipo === 'saliente') {
      document.getElementById('email2').value = c.email || '';
      document.getElementById('caller_id2').value = c.caller_id || '';
      document.getElementById('estrategia2').value = c.estrategia || '';
      document.getElementById('cadena_marcado').value = c.cadena_marcado || '';
      document.getElementById('reintento').value = c.reintento || '';
      document.getElementById('wrap_up').value = c.wrap_up_time || '';
      document.getElementById('ringing').value = c.ringing_time || '';
      document.getElementById('timeout').value = c.dial_timeout || '';
      document.getElementById('sip_trunk_select').value = c.sip_trunk_id || '';
    } else if (c.tipo === 'whatsapp') {
      document.getElementById('bot_asociado').value = c.bot_id || '';
      document.getElementById('numero_origen').value = c.numero_origen || '';
      document.getElementById('flujo_asociado_wh').value = c.flujo_asociado || '';
      document.getElementById('proveedor_whatsapp').value = c.proveedor || '';
      // Rompehielos
      rompehielosSelec.length = 0;
      (c.rompehielos || []).forEach(t => rompehielosSelec.push(t));
      renderRompehielosList();
    }

    // Horarios
    document.getElementById('bloques-horario').innerHTML = '';
    (c.horarios || []).forEach(b => {
      agregarBloqueHorario();
      const last = document.querySelector('#bloques-horario > div:last-child');
      b.dias.forEach(d => {
        const cb = last.querySelector(`input[type=checkbox][value="${d}"]`);
        if (cb) cb.checked = true;
      });
      const times = last.querySelectorAll('input[type=time]');
      times[0].value = b.desde;
      times[1].value = b.hasta;
    });

    alert('✅ Campaña cargada para edición');
  } catch (err) {
    console.error('Error al cargar campaña para edición:', err);
    alert('❌ Error al cargar la campaña para edición');
  }
}

// --- Eliminar campaña ---
async function handleEliminarCampana() {
  if (!editId) {
    alert('❌ No hay ninguna campaña seleccionada para eliminar.');
    return;
  }
  if (confirm('¿Estás seguro de que deseas eliminar esta campaña?')) {
    await eliminarCampana(editId);
    alert('✅ Campaña eliminada');
    clearForm();
    mostrarCampanasEnLista(); // Usamos la función importada
  }
}

// --- Limpiar formulario ---
function clearForm() {
  document.getElementById('form-campana').reset();
  document.getElementById('bloques-horario').innerHTML = '';
  document.getElementById('rompehielos-list').innerHTML = '';
  rompehielosSelec.length = 0;
  editId = null;
}

// --- Inicialización ---
async function inicializarUI() {
  try {
    await cargarSelect('ivr_asociado', 'ivrs', 'nombre');
    await cargarSelect('rompehielos', 'rompehielos', 'texto');
    await cargarSelect('bot_asociado', 'bots', 'nombre');
    await cargarSelect('bienvenida_audio', 'audios', 'archivo');
    await cargarSelect('espera_audio', 'audios', 'archivo');
    await cargarSelect('bienvenida_audio2', 'audios', 'archivo');
    await cargarSelect('espera_audio2', 'audios', 'archivo');
    await cargarSelect('sip_trunk_select', 'sip_trunks', 'nombre');
  } catch (e) {
    console.error('Error cargando selects dinámicos:', e);
  }
  mostrarCampanasEnLista(); // Usamos la función importada
}

// Llama a la inicialización al cargar el módulo
inicializarUI();

// --- Exponer funciones globales ---
window.guardarCampana = guardarCampana;
window.handleEliminarCampana = handleEliminarCampana;
window.clearForm = clearForm;

window.onerror = function(message, source, lineno, colno, error) {
  console.error('Error global:', message, 'en', source, 'línea', lineno, 'col', colno, error);
};
