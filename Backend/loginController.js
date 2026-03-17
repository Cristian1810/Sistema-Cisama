const { pool } = require('./usuarioController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Cambia esta clave por una segura
const JWT_SECRET = 'mi_clave_secreta';

async function loginUsuario(req, res) {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    const usuario = result.rows[0];
    if (
      !usuario.activo ||
      usuario.activo === false ||
      usuario.activo === 0 ||
      usuario.activo === 'false' ||
      usuario.activo === '0' ||
      usuario.activo === null ||
      usuario.activo === undefined
    ) {
      return res.status(403).json({ error: 'Usuario deshabilitado. Contacta al administrador.' });
    }
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    // Genera token JWT incluyendo el email
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol, email: usuario.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      rol: usuario.rol,
      curso: usuario.curso,
      activo: usuario.activo,
      foto: usuario.foto || '',
    });
  } catch (error) {
    // Log de error en caso de fallo en login
    console.error('Error en login:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { loginUsuario };
