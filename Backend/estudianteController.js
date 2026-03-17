require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Crear un nuevo estudiante
async function crearEstudiante(req, res) {
  const { nombre, apellido, grado, seccion, turno, horaEntrada, horaSalida, telefono, curso_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO estudiantes (nombre, apellido, grado, seccion, turno, hora_entrada, hora_salida, telefono, curso_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [nombre, apellido, grado, seccion, turno, horaEntrada, horaSalida, telefono, curso_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Log de error en caso de fallo al crear estudiante
    console.error('Error al crear estudiante:', error);
    res.status(500).json({ error: error.message });
  }
}

// Obtener todos los estudiantes
async function obtenerEstudiantes(req, res) {
  try {
    const result = await pool.query('SELECT * FROM estudiantes ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Editar un estudiante existente
async function editarEstudiante(req, res) {
  const { id } = req.params;
  const { nombre, apellido, grado, seccion, turno, horaEntrada, horaSalida, telefono, curso_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE estudiantes SET nombre=$1, apellido=$2, grado=$3, seccion=$4, turno=$5, hora_entrada=$6, hora_salida=$7, telefono=$8, curso_id=$9 WHERE id=$10 RETURNING *',
      [nombre, apellido, grado, seccion, turno, horaEntrada, horaSalida, telefono, curso_id, id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Estudiante no encontrado para editar', id });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Eliminar un estudiante existente
async function eliminarEstudiante(req, res) {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM estudiantes WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  crearEstudiante,
  obtenerEstudiantes,
  editarEstudiante,
  eliminarEstudiante,
};
