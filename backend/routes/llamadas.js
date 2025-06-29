// routes/llamadas.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// Listar CDR por campaña
router.get('/:campana_id', async (req, res) => {
  const { campana_id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT * FROM crm_gestiones.llamadas
       WHERE campana_id=$1 ORDER BY fecha_inicio DESC`,
      [campana_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar llamada
router.post('/', async (req, res) => {
  const {
    campana_tipo, campana_id, contacto_id, extension_id,
    contexto, numero_in, numero_out, canal, ultima_aplicacion,
    duracion, espera, disposicion, agente, base_marcada,
    tipificacion, guid, tipo, path_grabacion,
    fecha_inicio, fecha_fin, preview, observaciones
  } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO crm_gestiones.llamadas (
         campana_tipo, campana_id, contacto_id, extension_id,
         contexto, numero_in, numero_out, canal, ultima_aplicacion,
         duracion, espera, disposicion, agente, base_marcada,
         tipificacion, guid, tipo, path_grabacion,
         fecha_inicio, fecha_fin, preview, observaciones
       ) VALUES (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
         $11,$12,$13,$14,$15,$16,$17,$18,
         $19,$20,$21,$22
       ) RETURNING *`,
      [
        campana_tipo, campana_id, contacto_id, extension_id,
        contexto, numero_in, numero_out, canal, ultima_aplicacion,
        duracion, espera, disposicion, agente, base_marcada,
        tipificacion, guid, tipo, path_grabacion,
        fecha_inicio, fecha_fin, preview, observaciones
      ]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
