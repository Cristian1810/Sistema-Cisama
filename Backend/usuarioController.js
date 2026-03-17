// Eliminar todos los usuarios excepto el administrador (solo admin)
async function eliminarUsuariosExceptoAdmin(req, res) {
  try {
    await pool.query("DELETE FROM usuarios WHERE rol != 'admin'");
    res.json({ success: true, message: 'Usuarios eliminados excepto el administrador' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// Eliminar todos los usuarios (solo admin)
async function eliminarTodosUsuarios(req, res) {
  try {
    await pool.query('DELETE FROM usuarios');
    res.json({ success: true, message: 'Todos los usuarios eliminados' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// Obtener todos los usuarios (solo admin)
async function obtenerUsuarios(req, res) {
  try {
    const result = await pool.query('SELECT id, nombre, apellido, email, curso, rol, activo FROM usuarios ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    // Log de error en caso de fallo al obtener usuarios
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: error.message });
  }
}
require('dotenv').config();
const { Pool } = require('pg');

// Configura la conexión a PostgreSQL usando variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Función para registrar un usuario (solo admin)
async function crearUsuario(req, res) {
  const { nombre, apellido, email, curso, rol, password, activo } = req.body;

  // Validar rol
  const rolesPermitidos = ['admin', 'profesor', 'suplente'];
  if (!rolesPermitidos.includes(rol)) {
    return res.status(400).json({ error: 'Rol no permitido' });
  }

  try {
    // Encriptar la contraseña antes de guardar
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, apellido, email, curso, rol, password, activo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nombre, apellido, email, curso, rol, hashedPassword, activo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Log de error en caso de fallo al crear usuario
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: error.message });
  }
}

// Editar usuario
async function editarUsuario(req, res) {
  const { id } = req.params;
  const { nombre, apellido, email, curso, password } = req.body;
  try {
    let result;
    if (password && password.trim() !== '') {
      // Si se envía una nueva contraseña, actualizarla (encriptada)
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash(password, 10);
      result = await pool.query(
        'UPDATE usuarios SET nombre=$1, apellido=$2, email=$3, curso=$4, password=$5 WHERE id=$6 RETURNING id, nombre, apellido, email, curso, rol, activo',
        [nombre, apellido, email, curso, hashedPassword, id]
      );
    } else {
      // Si no se envía contraseña, no la actualices
      result = await pool.query(
        'UPDATE usuarios SET nombre=$1, apellido=$2, email=$3, curso=$4 WHERE id=$5 RETURNING id, nombre, apellido, email, curso, rol, activo',
        [nombre, apellido, email, curso, id]
      );
    }
    const usuario = result.rows[0];
    res.json(usuario);
  } catch (error) {
    // Log de error en caso de fallo al editar usuario
    console.error('Error al editar usuario:', error);
    res.status(500).json({ error: error.message });
  }
}

// Deshabilitar usuario
async function deshabilitarUsuario(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query('UPDATE usuarios SET activo=false WHERE id=$1 RETURNING *', [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Habilitar usuario
async function habilitarUsuario(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query('UPDATE usuarios SET activo=true WHERE id=$1 RETURNING *', [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Eliminar usuario
async function eliminarUsuario(req, res) {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM usuarios WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  crearUsuario,
  editarUsuario,
  deshabilitarUsuario,
  habilitarUsuario,
  eliminarUsuario,
  obtenerUsuarios,
  eliminarTodosUsuarios,
  eliminarUsuariosExceptoAdmin,
  pool,
};
