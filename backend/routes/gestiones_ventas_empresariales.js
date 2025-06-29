// routes/gestiones_ventas_empresariales.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// Listar gestiones
router.get('/', async (req, res) => {
  const { campana_id, id_cliente } = req.query;
  let sql = 'SELECT * FROM crm_gestiones.gestiones_formulario_ventas_empresariales WHERE 1=1';
  const params = [];
  if (campana_id) {
    params.push(campana_id);
    sql += ` AND campana_id=$${params.length}`;
  }
  if (id_cliente) {
    params.push(id_cliente);
    sql += ` AND id_cliente=$${params.length}`;
  }
  sql += ' ORDER BY fecha DESC';
  try {
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear gestión
router.post('/', async (req, res) => {
  const {
    campana_tipo, campana_id, id_cliente, guid_interaccion,
    nivel_1, nivel_2, nivel_3, nivel_4, nivel_5,
    nivel_6, nivel_7, nivel_8, nivel_9, nivel_10,
    comentarios
  } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO crm_gestiones.gestiones_formulario_ventas_empresariales (
         campana_tipo, campana_id, id_cliente, guid_interaccion,
         nivel_1, nivel_2, nivel_3, nivel_4, nivel_5,
         nivel_6, nivel_7, nivel_8, nivel_9, nivel_10,
         comentarios
       ) VALUES (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
       ) RETURNING *`,
      [
        campana_tipo, campana_id, id_cliente, guid_interaccion,
        nivel_1, nivel_2, nivel_3, nivel_4, nivel_5,
        nivel_6, nivel_7, nivel_8, nivel_9, nivel_10,
        comentarios
      ]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar gestión
router.put('/:id', async (req, res) => {
  const {
    campana_tipo, campana_id, id_cliente, guid_interaccion,
    nivel_1, nivel_2, nivel_3, nivel_4, nivel_5,
    nivel_6, nivel_7, nivel_8, nivel_9, nivel_10,
    comentarios
  } = req.body;
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `UPDATE crm_gestiones.gestiones_formulario_ventas_empresariales SET
         campana_tipo=$1, campana_id=$2, id_cliente=$3, guid_interaccion=$4,
         nivel_1=$5, nivel_2=$6, nivel_3=$7, nivel_4=$8, nivel_5=$9,
         nivel_6=$10, nivel_7=$11, nivel_8=$12, nivel_9=$13, nivel_10=$14,
         comentarios=$15
       WHERE id=$16 RETURNING *`,
      [
        campana_tipo, campana_id, id_cliente, guid_interaccion,
        nivel_1, nivel_2, nivel_3, nivel_4, nivel_5,
        nivel_6, nivel_7, nivel_8, nivel_9, nivel_10,
        comentarios, id
      ]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar gestión
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'DELETE FROM crm_gestiones.gestiones_formulario_ventas_empresariales WHERE id=$1',
      [id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
