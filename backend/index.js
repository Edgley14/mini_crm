// index.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/campanas',      require('./routes/campanas'));
app.use('/api/extensiones',   require('./routes/extensiones'));
app.use('/api/llamadas',      require('./routes/llamadas'));
app.use('/api/asignaciones',  require('./routes/asignaciones'));
app.use('/api/tipificaciones',require('./routes/tipificaciones'));
app.use(
  '/api/gestiones/ventas_empresariales',
  require('./routes/gestiones_ventas_empresariales')
);

// Health check
app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en puerto ${PORT}`);
});
