import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../Css/cursos_creados.css';
import AlumnosPorCurso from './AlumnosPorCurso';

export default function Cursos_Creados({ search = "" }) {
  const location = useLocation();
  // Extraer usuario desde el estado de navegación si está disponible
  const user = location.state?.user || JSON.parse(localStorage.getItem('user')) || null;
  const [cursos, setCursos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [editCurso, setEditCurso] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  // Ocultar alertas automáticamente después de 5 segundos
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const fetchCursos = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/cursos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
    })
      .then(res => res.json())
      .then(data => {
        // Log para depuración: mostrar cursos y color
        // Cursos recibidos del backend (para depuración)
        if (Array.isArray(data)) {
          // Filtrar cursos si el usuario es profesor o suplente
          if (user && (user.rol === 'profesor' || user.rol === 'suplente')) {
            setCursos(data.filter(c => c.profesor === user.email && c.rol === user.rol));
          } else {
            setCursos(data);
          }
        } else {
          setCursos([]);
        }
      })
      .catch(() => setCursos([]));
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  // Filtrar cursos según búsqueda
  useEffect(() => {
    if (!search) {
      setFiltered(cursos);
    } else {
      const s = search.toLowerCase();
      setFiltered(
        cursos.filter(c =>
          (c.titulo && c.titulo.toLowerCase().includes(s)) ||
          (c.profesor && c.profesor.toLowerCase().includes(s)) ||
          (c.horario && c.horario.toLowerCase().includes(s))
        )
      );
    }
  }, [search, cursos]);

  // Edición
  const handleEdit = idx => {
    setEditIdx(idx);
    setEditCurso({ ...cursos[idx] });
  };
  const handleChange = e => {
    const { name, value } = e.target;
    setEditCurso(c => ({ ...c, [name]: value }));
  };
  const handleSaveEdit = async idx => {
    setLoading(true);
    try {
      const curso = editCurso;
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/cursos/${curso.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(curso)
      });
      if (response.ok) {
        setEditIdx(null);
        setEditCurso(null);
        setAlert({ type: 'success', msg: 'Curso editado correctamente.' });
        fetchCursos();
      } else {
        setAlert({ type: 'danger', msg: 'Error al editar curso.' });
      }
    } catch {
      setAlert({ type: 'danger', msg: 'Error de conexión.' });
    }
    setLoading(false);
  };

  // Modal de eliminación
  const handleDelete = idx => {
    setDeleteIdx(idx);
    setShowModal(true);
  };
  const confirmDelete = async () => {
    setLoading(true);
    const curso = cursos[deleteIdx];
    try {
      const response = await fetch(`http://localhost:3000/cursos/${curso.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setAlert({ type: 'success', msg: 'Curso eliminado correctamente.' });
        setShowModal(false);
        setDeleteIdx(null);
        fetchCursos();
      } else {
        setAlert({ type: 'danger', msg: 'Error al eliminar curso.' });
      }
    } catch {
      setAlert({ type: 'danger', msg: 'Error de conexión.' });
    }
    setLoading(false);
  };
  const cancelDelete = () => {
    setShowModal(false);
    setDeleteIdx(null);
  };

  // Funciones de desactivación y reactivación
  const handleDeactivate = async (idx) => {
    const curso = cursos[idx];
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/cursos/${curso.id}/desactivar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      fetchCursos();
    } catch {}
  };

  const handleReactivate = async (idx) => {
    const curso = cursos[idx];
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/cursos/${curso.id}/reactivar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      fetchCursos();
    } catch {}
  };

  // Render
  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f9fa' }}>
      <div className="cursos-creados-container" style={{ margin: '0 auto', width: '100%', maxWidth: 1200 }}>
        <h2 className="cursos-creados-titulo">Cursos Estudiantiles</h2>
        {alert && (
          <div className={`alert alert-${alert.type} text-center animate__animated animate__fadeIn`} style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 24 }}>
            <i className={`bi bi-${alert.type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>{alert.msg}
          </div>
        )}
        <div className="cursos-creados-grid" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          alignItems: 'stretch',
          marginTop: 24
        }}>
          {(Array.isArray(filtered) ? filtered : []).map((c, idx) => (
            <div className="cursos-creados-card" key={c.id || idx} style={{ background: c.color ? c.color : '#1976d2', color: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #1976d233', padding: 16, width: '100%' }}>
              <img src={c.imagen} alt={c.titulo} className="cursos-creados-img" />
              <div className="cursos-creados-body">
                {editIdx === idx ? (
                  <form className="w-100 animate__animated animate__fadeIn" style={{ color: '#333', background: '#f7f9fa', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #1976d233', marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                      <div style={{ flex: 2 }}>
                        <label className="form-label">Título</label>
                        <input type="text" name="titulo" className="form-control fw-bold" value={editCurso.titulo} onChange={handleChange} required />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="form-label">Color</label>
                        <input type="color" name="color" className="form-control" value={editCurso.color} onChange={handleChange} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                      <div style={{ flex: 2 }}>
                        <label className="form-label">Imagen (URL)</label>
                        <input type="text" name="imagen" className="form-control" value={editCurso.imagen} onChange={handleChange} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="form-label">Profesor</label>
                        <input type="text" name="profesor" className="form-control" value={editCurso.profesor} onChange={handleChange} required />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="form-label">Horario</label>
                        <select name="horario" className="form-control" value={editCurso.horario} onChange={handleChange} required>
                          <option value="">Selecciona horario</option>
                          <option value="mañana">Mañana</option>
                          <option value="tarde">Tarde</option>
                        </select>
                      </div>
                    </div>
                    <div className="cursos-creados-actions" style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
                      <button className="btn btn-success fw-bold px-4" type="button" onClick={() => handleSaveEdit(idx)} disabled={loading}>
                        <i className="bi bi-check-circle me-2"></i>Guardar
                      </button>
                      <button className="btn btn-secondary fw-bold px-4" type="button" onClick={() => { setEditIdx(null); setEditCurso(null); }} disabled={loading}>
                        <i className="bi bi-x-circle me-2"></i>Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h5 className="cursos-creados-title">
                      <i className="bi bi-journal-bookmark me-2"></i>{c.titulo}
                    </h5>
                    <div className="mb-2">Profesor: <span className="fw-bold">{c.profesor}</span></div>
                    <div className="mb-2">Horario: <span className="fw-bold">{c.horario}</span></div>
                    <div className="cursos-creados-actions">
                      {user && user.rol === 'admin' && (
                        <>
                          <button className="btn btn-primary" onClick={() => handleEdit(idx)}>
                            <i className="bi bi-pencil-square me-2"></i>Editar
                          </button>
                          <button
                            className={`btn btn-danger${!c.activo ? ' disabled' : ''}`}
                            style={!c.activo ? { backgroundColor: '#8B0000', borderColor: '#8B0000', color: '#fff', opacity: 0.85, pointerEvents: 'none' } : {}}
                            onClick={() => {
                              setDeleteIdx(idx);
                              setShowModal('deactivate');
                            }}
                            disabled={!c.activo}
                          >
                            <i className="bi bi-x-circle me-2"></i>Desactivar
                          </button>
                          <button className="btn btn-success" onClick={() => handleReactivate(idx)} disabled={c.activo}>
                            <i className="bi bi-arrow-repeat me-2"></i>Reactivar
                          </button>
                          <button className="btn btn-dark" onClick={() => handleDelete(idx)}>
                            <i className="bi bi-trash me-2"></i>Eliminar
                          </button>
                        </>
                      )}
                    </div>
                    <AlumnosPorCurso cursoId={c.id} />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Modal de confirmación profesional */}
        {showModal === 'deactivate' && deleteIdx !== null && (
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(25,118,210,0.18)', zIndex: 9999 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content animate__animated animate__fadeInUp" style={{ borderRadius: 18 }}>
                <div className="modal-header bg-warning text-dark">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-x-circle me-2"></i>Confirmar desactivación
                  </h5>
                  <button type="button" className="btn-close" onClick={cancelDelete}></button>
                </div>
                <div className="modal-body text-center">
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>¿Deseas desactivar el curso <span className="text-warning">{cursos[deleteIdx].titulo}</span>?</p>
                  <img src={cursos[deleteIdx].imagen} alt={cursos[deleteIdx].titulo} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} />
                </div>
                <div className="modal-footer d-flex justify-content-center gap-3">
                  <button className="btn btn-secondary fw-bold" onClick={cancelDelete} disabled={loading}>
                    <i className="bi bi-x-circle me-2"></i>Cancelar
                  </button>
                  <button className="btn btn-warning fw-bold" onClick={async () => { await handleDeactivate(deleteIdx); setShowModal(false); setDeleteIdx(null); }} disabled={loading}>
                    <i className="bi bi-x-circle me-2"></i>Desactivar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showModal === true && deleteIdx !== null && (
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(25,118,210,0.18)', zIndex: 9999 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content animate__animated animate__fadeInUp" style={{ borderRadius: 18 }}>
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-trash me-2"></i>Confirmar eliminación
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={cancelDelete}></button>
                </div>
                <div className="modal-body text-center">
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>¿Estás seguro de que deseas eliminar el curso <span className="text-danger">{cursos[deleteIdx].titulo}</span>?</p>
                  <img src={cursos[deleteIdx].imagen} alt={cursos[deleteIdx].titulo} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} />
                </div>
                <div className="modal-footer d-flex justify-content-center gap-3">
                  <button className="btn btn-secondary fw-bold" onClick={cancelDelete} disabled={loading}>
                    <i className="bi bi-x-circle me-2"></i>Cancelar
                  </button>
                  <button className="btn btn-danger fw-bold" onClick={confirmDelete} disabled={loading}>
                    <i className="bi bi-trash me-2"></i>Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
