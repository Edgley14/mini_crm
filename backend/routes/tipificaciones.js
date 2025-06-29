// routes/tipificaciones.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// GET /api/tipificaciones?campana_tipo=tipo&campana_id=id
router.get('/', async (req, res) => {
  const { campana_tipo, campana_id } = req.query;
  if (!campana_tipo || !campana_id) {
    return res.status(400).json({ error: 'campana_tipo y campana_id son obligatorios' });
  }
  try {
    const { rows } = await pool.query(
      `SELECT nivel_1, nivel_2, nivel_3, nivel_4, nivel_5,
              nivel_6, nivel_7, nivel_8, nivel_9, nivel_10
       FROM crm_gestiones.tipificaciones
       WHERE campana_tipo=$1 AND campana_id=$2`,
      [campana_tipo, campana_id]
    );
    if (!rows.length) return res.json({});  // sin configuraciones
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/tipificaciones
router.post('/', async (req, res) => {
  const {
    campana_tipo, campana_id,
    nivel_1, nivel_2, nivel_3, nivel_4, nivel_5,
    nivel_6, nivel_7, nivel_8, nivel_9, nivel_10
  } = req.body;
  if (!campana_tipo || !campana_id) {
    return res.status(400).json({ error: 'campana_tipo y campana_id son obligatorios' });
  }
  try {
    // borrar previas
    await pool.query(
      `DELETE FROM crm_gestiones.tipificaciones
       WHERE campana_tipo=$1 AND campana_id=$2`,
      [campana_tipo, campana_id]
    );
    // insertar nuevas
    const { rows } = await pool.query(
      `INSERT INTO crm_gestiones.tipificaciones (
         campana_tipo, campana_id,
         nivel_1, nivel_2, nivel_3, nivel_4, nivel_5,
         nivel_6, nivel_7, nivel_8, nivel_9, nivel_10
       ) VALUES (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
       ) RETURNING *`,
      [
        campana_tipo, campana_id,
        nivel_1||'', nivel_2||'', nivel_3||'', nivel_4||'', nivel_5||'',
        nivel_6||'', nivel_7||'', nivel_8||'', nivel_9||'', nivel_10||''
      ]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
