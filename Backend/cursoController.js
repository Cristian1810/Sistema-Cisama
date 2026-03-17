require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Crear un nuevo curso
async function crearCurso(req, res) {
  const { titulo, imagen, color, profesor, horario, rol } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cursos (titulo, imagen, color, profesor, horario, rol) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [titulo, imagen, color, profesor, horario, rol]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Log de error en caso de fallo al crear curso
    console.error('Error al crear curso:', error);
    res.status(500).json({ error: error.message });
  }
}

// Listar todos los cursos
async function obtenerCursos(req, res) {
  try {
    const result = await pool.query('SELECT * FROM cursos ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Editar un curso existente
async function editarCurso(req, res) {
  const { id } = req.params;
  const { titulo, imagen, color, profesor, horario, rol } = req.body;
  try {
    const result = await pool.query(
      'UPDATE cursos SET titulo=$1, imagen=$2, color=$3, profesor=$4, horario=$5, rol=$6 WHERE id=$7 RETURNING *',
      [titulo, imagen, color, profesor, horario, rol, id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Curso no encontrado para editar', id });
    }
    res.json(result.rows[0]);
  } catch (error) {
    // Log de error en caso de fallo al editar curso
    console.error('Error al editar curso:', error);
    res.status(500).json({ error: error.message });
  }
}

// Eliminar curso
async function eliminarCurso(req, res) {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM cursos WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Desactivar curso y usuarios asignados
async function desactivarCurso(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Desactivar el curso
    const cursoResult = await client.query('UPDATE cursos SET activo=false WHERE id=$1 RETURNING *', [id]);
    if (!cursoResult.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Curso no encontrado para desactivar', id });
    }
    // Desactivar usuarios asignados a este curso
    await client.query('UPDATE usuarios SET activo=false WHERE curso=$1', [id]);
    await client.query('COMMIT');
    res.json({ success: true, curso: cursoResult.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
}

// Reactivar curso y usuarios asignados
async function reactivarCurso(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Reactivar el curso
    const cursoResult = await client.query('UPDATE cursos SET activo=true WHERE id=$1 RETURNING *', [id]);
    if (!cursoResult.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Curso no encontrado para reactivar', id });
    }
    // Reactivar usuarios asignados a este curso
    await client.query('UPDATE usuarios SET activo=true WHERE curso=$1', [id]);
    await client.query('COMMIT');
    res.json({ success: true, curso: cursoResult.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
}

module.exports = {
  crearCurso,
  obtenerCursos,
  editarCurso,
  eliminarCurso,
  desactivarCurso,
  reactivarCurso,
};
