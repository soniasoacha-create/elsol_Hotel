const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
connectDB(); // Conecta a MongoDB

app.use(express.json());
app.use('/api/usuarios', require('./routes/usuarios'));

// Aquí van tus rutas
// app.use('/api/usuarios', require('./routes/usuarios'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});