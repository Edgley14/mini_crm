// routes/extensiones.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// Listar extensiones/usuarios
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM crm_config.usuarios ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear extensión/usuario
router.post('/', async (req, res) => {
  const { correo, extension, nombre, password, rol, activo } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO crm_config.usuarios
       (correo, extension, nombre, password, rol, activo)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [correo, extension, nombre, password, rol, activo]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar extensión/usuario
router.put('/:id', async (req, res) => {
  const { correo, extension, nombre, password, rol, activo } = req.body;
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `UPDATE crm_config.usuarios SET
         correo=$1, extension=$2, nombre=$3, password=$4, rol=$5, activo=$6
       WHERE id=$7 RETURNING *`,
      [correo, extension, nombre, password, rol, activo, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar extensión/usuario
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM crm_config.usuarios WHERE id=$1', [id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
