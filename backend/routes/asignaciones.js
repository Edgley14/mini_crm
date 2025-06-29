// routes/asignaciones.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// Listar asignaciones de agentes a campaña
router.get('/:campana_id', async (req, res) => {
  const { campana_id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT * FROM crm_config.campana_extensiones
       WHERE campana_id=$1`,
      [campana_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear asignación
router.post('/', async (req, res) => {
  const { campana_id, extension_id } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO crm_config.campana_extensiones
       (campana_id, extension_id)
       VALUES ($1,$2) RETURNING *`,
      [campana_id, extension_id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar asignación
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'DELETE FROM crm_config.campana_extensiones WHERE id=$1',
      [id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
