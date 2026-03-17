require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Crear una nueva clase
async function crearClase(req, res) {
  const { fecha, titulo, curso_id, horaEntrada, horaSalida, turno, observaciones, asistencia } = req.body;
  const profesor_email = req.user?.email || null;
  try {
    const result = await pool.query(
      'INSERT INTO clases (fecha, titulo, curso_id, hora_entrada, hora_salida, turno, observaciones, asistencia, profesor_email) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [fecha, titulo, curso_id, horaEntrada, horaSalida, turno, observaciones, JSON.stringify(asistencia), profesor_email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Log de error en caso de fallo al crear clase
    console.error('Error al crear clase:', error);
    res.status(500).json({ error: error.message });
  }
}

// Obtener clases (admin ve todas, profesor/suplente solo las suyas)
async function obtenerClases(req, res) {
  try {
    let result;
    if (req.user && req.user.rol === 'admin') {
      result = await pool.query('SELECT * FROM clases ORDER BY id DESC');
    } else if (req.user && (req.user.rol === 'profesor' || req.user.rol === 'suplente')) {
      result = await pool.query('SELECT * FROM clases WHERE profesor_email = $1 ORDER BY id DESC', [req.user.email]);
    } else {
      // Acceso denegado si el usuario no tiene permisos
      return res.status(403).json({ error: 'No autorizado' });
    }
    res.json(result.rows);
  } catch (error) {
    // Log de error en caso de fallo al obtener clases
    console.error('Error en obtenerClases:', error);
    res.status(500).json({ error: error.message });
  }
}

// Editar clase
async function editarClase(req, res) {
  const { id } = req.params;
  const { fecha, titulo, curso_id, horaEntrada, horaSalida, turno, observaciones, asistencia } = req.body;
  try {
    const result = await pool.query(
      'UPDATE clases SET fecha=$1, titulo=$2, curso_id=$3, hora_entrada=$4, hora_salida=$5, turno=$6, observaciones=$7, asistencia=$8 WHERE id=$9 RETURNING *',
      [fecha, titulo, curso_id, horaEntrada, horaSalida, turno, observaciones, JSON.stringify(asistencia), id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Clase no encontrada para editar', id });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Eliminar clase
async function eliminarClase(req, res) {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM clases WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  crearClase,
  obtenerClases,
  editarClase,
  eliminarClase,
};
