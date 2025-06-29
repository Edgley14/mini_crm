// 1) Carga el formulario y luego las tipificaciones
async function loadTipificaciones(campanaTipo, campanaId) {
  // 1.1) Leer estructura del formulario
  const formRes = await fetch('data/formulario_ventas_empresariales.json');
  const formDef = await formRes.json();  // { campos: [...] }

  // 1.2) Leer opciones de tipificación del backend
  const tipRes = await fetch(
    `http://localhost:4000/api/tipificaciones?campana_tipo=${campanaTipo}&campana_id=${campanaId}`
  );
  const tipOpts = await tipRes.json(); // { nivel_1: "...", ..., nivel_10: "..." }

  // 2) Construir el formulario dinámico
  const container = document.getElementById('tipificacion-container');
  container.innerHTML = ''; // limpiar

  formDef.campos.forEach((campo, idx) => {
    const nivelKey = `nivel_${idx+1}`;
    const label = document.createElement('label');
    label.textContent = campo.etiqueta; // del JSON, ej {etiqueta:"Nivel 1",name:"nivel_1"}
    const input = document.createElement('select');
    input.id = nivelKey;
    // opción placeholder
    const opt0 = document.createElement('option');
    opt0.value = '';
    opt0.textContent = '-- Seleccione --';
    input.appendChild(opt0);
    // la única opción es la configurada en tipOpts[nivelKey]
    if (tipOpts[nivelKey]) {
      const opt = document.createElement('option');
      opt.value = tipOpts[nivelKey];
      opt.textContent = tipOpts[nivelKey];
      input.appendChild(opt);
    }
    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(document.createElement('br'));
  });

  // 3) Botón de Guardar
  let btn = document.getElementById('btn-guardar-tip');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'btn-guardar-tip';
    btn.textContent = 'Guardar Tipificación';
    container.appendChild(btn);
  }
  btn.onclick = () => saveTipificacion(campanaTipo, campanaId);
}

// 4) Guardar tipificación al backend
async function saveTipificacion(campanaTipo, campanaId) {
  const payload = { campana_tipo: campanaTipo, campana_id: campanaId };
  for (let i = 1; i <= 10; i++) {
    payload[`nivel_${i}`] = document.getElementById(`nivel_${i}`).value;
  }
  const res = await fetch('http://localhost:4000/api/tipificaciones', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if (!res.ok) return alert('Error guardando tipificaciones');
  alert('Tipificaciones guardadas');
}

// Ejemplo de invocación: cuando abras la UI de gestión de campaña
// loadTipificaciones('entrante', 1);
