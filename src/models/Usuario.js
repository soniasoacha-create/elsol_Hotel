import db from "../config/db.js";

/**
 * Clase que modela la entidad Usuario, mapeada a la tabla 'usuarios'.
 * Esta clase encapsula la lógica de acceso a datos para la entidad Usuario.
 */
export class Usuario {
    
    /**
     * Constructor: Inicializa un objeto Usuario con atributos basados en las columnas de la tabla.
     */
    constructor({ nombres, apellidos, email, password_hash, telefono, tipo_usuario = 'cliente' }) {
        // Los atributos reflejan las columnas de la tabla
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.email = email;
        this.password_hash = password_hash; // Almacenado como hash por seguridad
        this.telefono = telefono;
        this.tipo_usuario = tipo_usuario;
    }

    /**
     * Método de Instancia: Guarda (INSERT) el objeto Usuario actual en la base de datos.
     * @returns {number} El ID del usuario insertado.
     */
    async save() {
        const sql = `
            INSERT INTO usuarios (nombres, apellidos, email, password_hash, telefono, tipo_usuario, fecha_registro)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        const [result] = await db.execute(sql, [
            this.nombres, 
            this.apellidos, 
            this.email, 
            this.password_hash, 
            this.telefono, 
            this.tipo_usuario
        ]);
        // Retorna el ID generado por AUTO_INCREMENT
        return result.insertId;
    }

    /**
     * Método Estático: Busca un usuario en la DB por su correo electrónico (clave única).
     * @param {string} email - El correo electrónico a buscar.
     * @returns {object|null} El objeto usuario encontrado o null.
     */
    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Método Estático: Obtiene una lista de todos los usuarios registrados.
     * Por seguridad, excluye la columna 'password_hash' en el SELECT general.
     * @returns {Array} Lista de objetos usuario.
     */
    static async getAll() {
        const [rows] = await db.execute(
            'SELECT id_usuarios, nombres, apellidos, email, telefono, tipo_usuario, fecha_registro FROM usuarios'
        );
        return rows;
    }
}