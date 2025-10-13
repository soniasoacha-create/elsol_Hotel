import pool from "../config/db.js"; // se importa el pool la conexión que se crea de la bd
// NOTA: Se asume que pool es un objeto que tiene el método .query() para ejecutar SQL

// Métodos acciones esperadas:

export const obtenerUsuarios = async (req, res) => {
    // Consulta (SELECT) y regresa las filas en formato JSON (rows)
    const [rows] = await pool.query("SELECT * FROM usuarios"); 
    res.json(rows);
};


export const crearUsuario = async (req, res) => {
    // 1. Destructuración y Obtención de datos del Body
    const { nombres, apellidos, email, password, telefono } = req.body; 

    // **¡IMPORTANTE!** Aquí se debe hashear la contraseña antes de guardar. 
    // Usamos 'password' temporalmente como hash, pero NO es seguro.
    const password_hash = password; 
    
    // 2. Ejecución del INSERT en la DB (Corregidos nombres de columnas y placeholders)
    try {

        await pool.query(
            "INSERT INTO usuarios (nombres, apellidos, email, password_hash, telefono) VALUES (?, ?, ?, ?, ?)", 
            [
                nombres,
                apellidos,
                email,
                password_hash, // Se utiliza el valor de la contraseña para la columna password_hash
                telefono,
            ]
        );
        // Respuesta 201 Created (preferible para POST exitoso)
        res.status(201).json ({ message: "Usuario creado exitosamente." });

    } catch (error) {
        // Manejo de errores (ej: email duplicado, error de conexión)
        console.error("Error al crear usuario:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al crear usuario.",
            error: error.sqlMessage || error.message // Muestra el mensaje de error SQL si existe
        });
    }
};

export const actualizarUsuario = async (req, res) => {
    // CAMBIO CLAVE: Usaremos 'id' aquí, ya que es el parámetro más común en las rutas.
    // Si tu ruta es '/usuarios/:id', esta línea FUNCIONARÁ:
    const { id } = req.params; 
    
    // Si la variable 'id' es undefined (si la ruta no tiene el parámetro), salimos temprano.
    if (!id) {
        return res.status(400).json({ message: "El ID del usuario es requerido para la actualización." });
    }

    const { nombres, apellidos, email, telefono } = req.body;
    
    try {
        const [result] = await pool.query(
            // La cláusula WHERE usa el nombre de la columna: id_usuarios
            "UPDATE usuarios SET nombres = ?, apellidos = ?, email = ?, telefono = ? WHERE id_usuarios = ?",
            // Usamos la variable extraída 'id'
            [nombres, apellidos, email, telefono, id] 
        ); 
        
        if (result.affectedRows === 0) {
            // El problema de 'undefined' aquí DEBE desaparecer si el mapeo es correcto.
            return res.status(404).json({ message: `Usuario con ID ${id} no encontrado o datos idénticos.` });
        }
        
        res.json ({ message: `Usuario con ID ${id} actualizado.` });
        
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al actualizar usuario.",
            error: error.sqlMessage || error.message
        });
    }
};


export const eliminarUsuario = async (req, res) => {
    // El ID de la tabla es id_usuarios, no id
    const { id_usuarios } = req.params; 
    
    await pool.query ("DELETE FROM usuarios WHERE id_usuarios = ?", [id_usuarios]);
    // Corregida coma por punto: res,json -> res.json
    res.json({ message: "Usuario eliminado." });
};