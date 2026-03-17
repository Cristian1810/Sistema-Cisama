const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');
const rateLimit = require('express-rate-limit');
app.use(cors({
  origin: 'https://sistema-cisama.vercel.app',
}));
app.use(cors());

// Limitar a 100 peticiones por IP cada 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 peticiones por IP
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.'
});
app.use(limiter); // Aplica el limitador a todas las rutas
// Permitir payloads grandes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
const { loginUsuario } = require('./loginController');
const { crearCurso, obtenerCursos, editarCurso, eliminarCurso, desactivarCurso, reactivarCurso } = require('./cursoController');
const { crearClase, obtenerClases, editarClase, eliminarClase } = require('./claseController');
const { crearUsuario, editarUsuario, deshabilitarUsuario, habilitarUsuario, eliminarUsuario, obtenerUsuarios, eliminarTodosUsuarios, eliminarUsuariosExceptoAdmin } = require('./usuarioController');
const { crearEstudiante, obtenerEstudiantes, editarEstudiante, eliminarEstudiante } = require('./estudianteController');

app.use(express.json());

// Endpoint para login
app.post('/login', loginUsuario);
app.use(express.json());

// Middleware de autenticación JWT real
const { jwtAuthMiddleware } = require('./jwtAuthMiddleware');

// Middleware para verificar rol de admin
function adminOnly(req, res, next) {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso solo para administradores' });
  }
}

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// Endpoints de cursos
app.post('/cursos', jwtAuthMiddleware, crearCurso);
app.get('/cursos', jwtAuthMiddleware, obtenerCursos);
app.put('/cursos/:id', jwtAuthMiddleware, editarCurso);
app.delete('/cursos/:id', jwtAuthMiddleware, eliminarCurso);
app.patch('/cursos/:id/desactivar', jwtAuthMiddleware, adminOnly, desactivarCurso);
app.patch('/cursos/:id/reactivar', jwtAuthMiddleware, adminOnly, reactivarCurso);

// Endpoints de estudiantes
app.post('/estudiantes', jwtAuthMiddleware, crearEstudiante);
app.get('/estudiantes', jwtAuthMiddleware, obtenerEstudiantes);
app.put('/estudiantes/:id', jwtAuthMiddleware, editarEstudiante);
app.delete('/estudiantes/:id', jwtAuthMiddleware, eliminarEstudiante);

// Endpoint para crear usuarios (solo admin)
app.get('/usuarios', jwtAuthMiddleware, adminOnly, obtenerUsuarios);
app.post('/usuarios', jwtAuthMiddleware, adminOnly, crearUsuario);
app.put('/usuarios/:id', jwtAuthMiddleware, (req, res, next) => {
  
  // Permitir editar propio perfil o si es admin
  const userId = req.user.id;
  const userRol = req.user.rol;
  const targetId = parseInt(req.params.id);
  if (userRol === 'admin' || userId === targetId) {
    next();
  } else {
    return res.status(403).json({ error: 'Solo puedes editar tu propio perfil o ser admin.' });
  }
}, editarUsuario);
app.patch('/usuarios/:id/disable', jwtAuthMiddleware, adminOnly, deshabilitarUsuario);
app.patch('/usuarios/:id/enable', jwtAuthMiddleware, adminOnly, habilitarUsuario);
app.patch('/usuarios/:id/enable', jwtAuthMiddleware, adminOnly, habilitarUsuario);
app.delete('/usuarios/:id', jwtAuthMiddleware, adminOnly, eliminarUsuario);
app.delete('/usuarios/all', jwtAuthMiddleware, adminOnly, eliminarTodosUsuarios);
app.delete('/usuarios/except-admin', jwtAuthMiddleware, adminOnly, eliminarUsuariosExceptoAdmin);

// Endpoints de clases
app.post('/clases', jwtAuthMiddleware, crearClase);
app.get('/clases', jwtAuthMiddleware, obtenerClases);
app.put('/clases/:id', jwtAuthMiddleware, editarClase);
app.delete('/clases/:id', jwtAuthMiddleware, eliminarClase);

app.listen(PORT, () => {
  // Servidor iniciado correctamente
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});