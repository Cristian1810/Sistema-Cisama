import React, { useState, useEffect, useRef } from 'react';
import '../Css/crear_curso.css';

export default function Crear_Curso({ onCrearCurso, cursosCreados }) {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [curso, setCurso] = useState({
    titulo: '',
    imagen: '',
    color: '#1976d2',
    profesor: '',
    horario: '',
    rol: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const cursosRef = useRef(null);
  const [profesores, setProfesores] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/usuarios', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        // Filtrar solo profesores y suplentes activos
        setProfesores(data.filter(u => (u.rol === 'profesor' || u.rol === 'suplente') && u.activo));
      })
      .catch(() => setProfesores([]));
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'imagen' && files && files[0]) {
      const reader = new FileReader();
      reader.onload = ev => setCurso({ ...curso, imagen: ev.target.result });
      reader.readAsDataURL(files[0]);
    } else {
      setCurso({ ...curso, [name]: value });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Validar color
    if (!curso.color || !/^#[0-9A-Fa-f]{6}$/.test(curso.color)) {
      setShowAlert(true);
      setSuccessMsg("");
      return;
    }
    fetch('http://localhost:3000/cursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(curso)
    })
      .then(res => res.json())
      .then(() => {
        setCurso({ titulo: '', imagen: '', color: '#1976d2', profesor: '', horario: '', rol: '' });
        setShowAlert(true);
        setSuccessMsg('Curso creado con éxito');
        setTimeout(() => {
          setShowAlert(false);
          setSuccessMsg("");
        }, 3500);
        if (cursosRef.current) {
          cursosRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        if (typeof onCursoCreado === 'function') {
          onCursoCreado();
        }
      })
      .catch(() => {
        setShowAlert(false);
        setSuccessMsg("");
      });
  };

  return (
    <div className="crear-curso-outer d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', padding: '0 0.5rem', background: 'linear-gradient(135deg, #e3f2fd 80%, #fff 100%)' }}>
      <div className="crear-curso-container animate-main" style={{ margin: '0 auto', maxWidth: 540 }}>
        <h2 className="fw-bold text-primary mb-4 text-center">Crear Curso Estudiantil</h2>
        <form className="crear-curso-form animate-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Título del curso</label>
            <input type="text" name="titulo" className="form-control" value={curso.titulo} onChange={handleChange} required placeholder="Ej: Baloncesto" />
          </div>
          <div className="mb-3">
            <label className="form-label">Imagen del curso</label>
            <input type="file" name="imagen" className="form-control" accept="image/*" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Color del curso</label>
            <input type="color" name="color" className="form-control form-control-color" value={curso.color} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Profesor del curso</label>
            <select name="profesor" className="form-control" value={curso.profesor} onChange={handleChange} required>
              <option value="">Seleccione profesor/suplente</option>
              {profesores.map(p => (
                <option key={p.id} value={p.email}>{p.nombre} {p.apellido} ({p.rol})</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Rol asignado</label>
            <select name="rol" className="form-control" value={curso.rol} onChange={handleChange} required>
              <option value="">Seleccione rol</option>
              <option value="profesor">Profesor</option>
              <option value="suplente">Suplente</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Horario</label>
            <select name="horario" className="form-control" value={curso.horario} onChange={handleChange} required>
              <option value="">Selecciona horario</option>
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
            </select>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary px-4 fw-bold">
              <i className="bi bi-plus-circle me-2"></i>Crear Curso
            </button>
          </div>
        </form>

        {/* Alerta de éxito animada y visible arriba */}
        {showAlert && successMsg && (
          <div className="alert alert-success animate__animated animate__fadeInDown" role="alert" style={{
            fontWeight: 'bold',
            fontSize: '1.1rem',
            background: '#fff',
            color: '#1976d2',
            border: '1px solid #1976d2',
            borderRadius: 12,
            boxShadow: '0 4px 16px rgba(25,118,210,0.10)',
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            minWidth: 320,
            maxWidth: 420
          }}>
            <i className="bi bi-check-circle me-2"></i>{successMsg}
          </div>
        )}
      </div>
    </div>
  );
}
