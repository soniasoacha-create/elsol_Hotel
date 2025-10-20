const Usuario = require('../models/Usuario');

// 🟢 Crear un nuevo usuario
const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'No se pudo crear el usuario' });
  }
};

// 🔵 Consultar todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al consultar usuarios:', error);
    res.status(500).json({ error: 'No se pudo obtener la lista de usuarios' });
  }
};

// 🟡 Actualizar usuario por ID
const actualizarUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'No se pudo actualizar el usuario' });
  }
};

// 🔴 Eliminar usuario por ID
const eliminarUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'No se pudo eliminar el usuario' });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario
};