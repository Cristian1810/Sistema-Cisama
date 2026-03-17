import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../Css/cursos_creados.css';

// Formatear hora a HH:mm
const formatHora = (hora) => {
  if (!hora) return '-';
  const match = /^\d{2}:\d{2}/.exec(hora);
  return match ? match[0] : hora;
};

export default function AlumnosPorCurso({ cursoId }) {
  const [alumnos, setAlumnos] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editAlumno, setEditAlumno] = useState(null);
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem('user')) || null;

  useEffect(() => {
    if (cursoId && visible) {
      const token = localStorage.getItem('token');
      fetch(`https://sistema-cisama-552k.onrender.com/estudiantes`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      })
        .then(res => res.json())
        .then(data => {
          setAlumnos(data.filter(a => Number(a.curso_id) === Number(cursoId)));
        })
        .catch(() => setAlumnos([]));
    }
  }, [cursoId, visible]);

  const handleDeleteAlumno = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este alumno?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://sistema-cisama-552k.onrender.com/estudiantes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (response.ok) {
        setAlumnos(alumnos => alumnos.filter(a => a.id !== id));
      } else {
        alert('Error al eliminar alumno');
      }
    } catch {
      alert('Error de conexión');
    }
  };

  const handleEditAlumno = (alumno) => {
    setEditAlumno({ ...alumno });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditAlumno(a => ({ ...a, [name]: value }));
  };
  const handleSaveEditAlumno = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://sistema-cisama-552k.onrender.com/estudiantes/${editAlumno.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(editAlumno)
      });
      if (response.ok) {
        setAlumnos(alumnos => alumnos.map(a => a.id === editAlumno.id ? editAlumno : a));
        setEditAlumno(null);
      } else {
        alert('Error al editar alumno');
      }
    } catch {
      alert('Error de conexión');
    }
  };
  const cancelEdit = () => setEditAlumno(null);

  const handleToggle = () => {
    setVisible(v => !v);
  };

  return (
    <div className="alumnos-por-curso-container" style={{ marginTop: 16 }}>
      <button
        className={`btn btn-outline-info btn-sm fw-bold mb-2 alumnos-toggle-btn animate__animated animate__fadeIn`}
        style={{ borderRadius: 12, fontSize: '0.95rem', boxShadow: '0 2px 8px #1976d233' }}
        onClick={handleToggle}
      >
        {visible ? 'Ocultar lista de alumnos' : 'Ver alumnos inscritos'}
      </button>
      {visible && (
        <div className="alumnos-list animate__animated animate__fadeInUp" style={{ background: '#f5f5f7', borderRadius: 14, boxShadow: '0 2px 12px #1976d233', padding: 12, overflowX: 'auto' }}>
          <h5 className="mb-3 text-primary fw-bold" style={{ fontSize: '1.1rem' }}>Alumnos inscritos</h5>
          <table className="table table-bordered table-sm" style={{ background: '#fff', borderRadius: 10, minWidth: 900 }}>
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Grado</th>
                <th>Sección</th>
                <th>Turno</th>
                <th>Teléfono</th>
                <th>Hora Entrada</th>
                <th>Hora Salida</th>
                <th style={{ minWidth: 120 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map(alumno => (
                <tr key={alumno.id} style={{ fontSize: '1.05rem', background: '#e3f2fd', borderRadius: 8 }}>
                  <td>{alumno.nombre}</td>
                  <td>{alumno.apellido}</td>
                  <td>{alumno.grado}</td>
                  <td>{alumno.seccion}</td>
                  <td>{alumno.turno}</td>
                  <td>{alumno.telefono}</td>
                  <td>{formatHora(alumno.horaEntrada || alumno.hora_entrada)}</td>
                  <td>{formatHora(alumno.horaSalida || alumno.hora_salida)}</td>
                  <td>
                    {user && user.rol === 'admin' && (
                      <>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditAlumno(alumno)}>
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAlumno(alumno.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {alumnos.length === 0 && <div className="text-muted">No hay alumnos inscritos en este curso.</div>}
        </div>
      )}
      {/* Modal de edición de alumno solo para admin */}
      {editAlumno && user && user.rol === 'admin' && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(25,118,210,0.18)', zIndex: 9999 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content animate__animated animate__fadeInUp" style={{ borderRadius: 18 }}>
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-pencil-square me-2"></i>Editar alumno
                </h5>
                <button type="button" className="btn-close" onClick={cancelEdit}></button>
              </div>
              <div className="modal-body">
                <form>
                  <input name="nombre" className="form-control mb-2" value={editAlumno.nombre} onChange={handleEditChange} placeholder="Nombre" />
                  <input name="apellido" className="form-control mb-2" value={editAlumno.apellido} onChange={handleEditChange} placeholder="Apellido" />
                  <input name="grado" className="form-control mb-2" value={editAlumno.grado} onChange={handleEditChange} placeholder="Grado" />
                  <input name="seccion" className="form-control mb-2" value={editAlumno.seccion} onChange={handleEditChange} placeholder="Sección" />
                  <input name="turno" className="form-control mb-2" value={editAlumno.turno} onChange={handleEditChange} placeholder="Turno" />
                  <input name="telefono" className="form-control mb-2" value={editAlumno.telefono} onChange={handleEditChange} placeholder="Teléfono" />
                  <input name="horaEntrada" className="form-control mb-2" value={editAlumno.horaEntrada} onChange={handleEditChange} placeholder="Hora de Entrada" type="time" />
                  <input name="horaSalida" className="form-control mb-2" value={editAlumno.horaSalida} onChange={handleEditChange} placeholder="Hora de Salida" type="time" />
                  <div className="d-flex justify-content-center mt-3 gap-2">
                    <button type="button" className="btn btn-success fw-bold" onClick={handleSaveEditAlumno}>
                      <i className="bi bi-save me-2"></i>Guardar
                    </button>
                    <button type="button" className="btn btn-secondary fw-bold" onClick={cancelEdit}>
                      <i className="bi bi-x-circle me-2"></i>Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
