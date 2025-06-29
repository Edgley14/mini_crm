// scripts/crm_dynamic.js
import { db } from './firebase-config.js';
import { doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

// Cargar formulario dinámico con niveles desplegables
async function cargarFormulario(tipoFormulario, contenedorId) {
  const niveles = ["Selecciona una opción", "null"]; // Placeholder por ahora

  const contenedor = document.getElementById(contenedorId);
  try {
    const res = await fetch(`/data/formulario_${tipoFormulario}.json`);
    const data = await res.json();

    contenedor.innerHTML = ''; // Limpia el contenedor

    Object.entries(data.secciones).forEach(([titulo, campos]) => {
      const seccion = document.createElement('div');
      seccion.className = 'ficha-crm-seccion';
      seccion.innerHTML = `<h3>${titulo}</h3>`;

      const grid = document.createElement('div');
      grid.className = 'grid-ficha';

      campos.forEach(campo => {
        const contenedorCampo = document.createElement('div');
        contenedorCampo.className = 'campo-ficha';

        const label = document.createElement('strong');
        label.textContent = campo;
        contenedorCampo.appendChild(label);

        if (campo.toLowerCase().startsWith('nivel')) {
          const select = document.createElement('select');
          select.id = campo;
          niveles.forEach(opcion => {
            const optionElement = document.createElement('option');
            optionElement.value = opcion === "Selecciona una opción" ? "" : opcion;
            optionElement.textContent = opcion;
            select.appendChild(optionElement);
          });
          contenedorCampo.appendChild(select);
        } else if (campo === 'comentario') {
          const textarea = document.createElement('textarea');
          textarea.id = campo;
          textarea.placeholder = 'Escribe un comentario...';
          contenedorCampo.appendChild(textarea);
        } else {
          const input = document.createElement('input');
          input.type = 'text';
          input.id = campo;
          input.placeholder = campo;
          contenedorCampo.appendChild(input);
        }

        grid.appendChild(contenedorCampo);
      });

      seccion.appendChild(grid);
      contenedor.appendChild(seccion);
    });

  } catch (error) {
    console.error("Error al cargar el formulario:", error);
  }
}

// Guardar gestión (sin cambios adicionales)
async function guardarGestion(clienteId = "cliente_mock") {
  const data = {};
  document.querySelectorAll('input, textarea, select').forEach(input => {
    data[input.id] = input.value;
  });
  document.querySelectorAll('.btn-tag.active').forEach(btn => {
    data[btn.dataset.res] = btn.textContent;
  });
  data.timestamp = serverTimestamp();
  data.usuario = localStorage.getItem("usuario") || "anónimo";

  await setDoc(doc(db, `gestiones/${clienteId}`), data);
  alert("✅ Gestión guardada");
}

export { cargarFormulario, guardarGestion };
