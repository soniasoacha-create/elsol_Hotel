const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombres: String,
  apellidos: String,
  email: { type: String, unique: true },
  password_hash: String,
  telefono: String,
  tipo_usuario: { type: String, enum: ['cliente', 'admin'], default: 'cliente' },
  fecha_registro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', usuarioSchema);