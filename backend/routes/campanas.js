// routes/campanas.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// Mapea tipos a nombres de tabla
const tablaPorTipo = {
  entrante: 'crm_config.campanas_entrantes',
  saliente: 'crm_config.campanas_salientes',
  marcador: 'crm_config.campanas_marcador',
  whatsapp:'crm_config.campanas_whatsapp'
};

// Listar campañas por tipo
router.get('/:tipo', async (req, res) => {
  const { tipo } = req.params;
  const tabla = tablaPorTipo[tipo];
  if (!tabla) return res.status(400).json({ error: 'Tipo de campaña inválido' });
  try {
    const { rows } = await pool.query(`SELECT * FROM ${tabla} ORDER BY id DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear campaña
router.post('/', async (req, res) => {
  const { tipo, ...data } = req.body;
  const tabla = tablaPorTipo[tipo];
  if (!tabla) return res.status(400).json({ error: 'Tipo de campaña inválido' });

  const campos = Object.keys(data);
  const valores = Object.values(data);
  const placeholders = campos.map((_, i) => `$${i + 1}`).join(',');

  try {
    const { rows } = await pool.query(
      `INSERT INTO ${tabla} (${campos.join(',')})
       VALUES (${placeholders}) RETURNING *`,
      valores
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar campaña
router.put('/:id', async (req, res) => {
  const { tipo, ...data } = req.body;
  const { id } = req.params;
  const tabla = tablaPorTipo[tipo];
  if (!tabla) return res.status(400).json({ error: 'Tipo de campaña inválido' });

  const campos = Object.keys(data);
  const valores = Object.values(data);
  const setString = campos.map((c, i) => `${c}=$${i + 1}`).join(',');

  try {
    const { rows } = await pool.query(
      `UPDATE ${tabla} SET ${setString}, updated_at=now()
       WHERE id=$${campos.length + 1} RETURNING *`,
      [...valores, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar campaña
router.delete('/:tipo/:id', async (req, res) => {
  const { tipo, id } = req.params;
  const tabla = tablaPorTipo[tipo];
  if (!tabla) return res.status(400).json({ error: 'Tipo de campaña inválido' });
  try {
    await pool.query(`DELETE FROM ${tabla} WHERE id=$1`, [id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
