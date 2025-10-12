// index.js
const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
connectDB(); // Conexión a MongoDB

app.use(express.json());

// Aquí conectas la ruta de usuarios
app.use('/api/usuarios', require('./routes/usuarios'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});