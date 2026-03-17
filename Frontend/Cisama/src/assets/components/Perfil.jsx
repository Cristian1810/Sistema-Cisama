import React, { useState } from 'react';
import '../Css/crear_curso.css';

export default function Perfil({ onLogout }) {
    // Función para cerrar sesión completamente
    const handleLogout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      if (typeof onLogout === 'function') onLogout();
      window.location.href = '/login'; // Redirige al login
    };
  const [editMode, setEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [perfil, setPerfil] = useState(() => {
    // Cargar perfil desde localStorage o valores por defecto
    const user = JSON.parse(localStorage.getItem('user')) || {};
    return {
      nombre: user.nombre || '',
      email: user.email || '',
      password: '',
      rol: user.rol || '',
      foto: user.foto || 'https://randomuser.me/api/portraits/men/32.jpg',
      id: user.id || '',
      apellido: user.apellido || '',
      curso: user.curso || '',
      activo: user.activo !== undefined ? user.activo : true,
    };
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setPerfil(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    // Recargar datos del usuario actual desde localStorage al entrar en modo edición
    const user = JSON.parse(localStorage.getItem('user')) || {};
    setPerfil({
      nombre: user.nombre || '',
      email: user.email || '',
      password: '',
      rol: user.rol || '',
      foto: user.foto || 'https://randomuser.me/api/portraits/men/32.jpg',
      id: user.id || '',
      apellido: user.apellido || '',
      curso: user.curso || '',
      activo: user.activo !== undefined ? user.activo : true,
    });
    setEditMode(true);
  };
  const handleSave = async e => {
    e.preventDefault();
    try {
      // Preparar datos para el backend
      const datos = {
        nombre: perfil.nombre,
        apellido: perfil.apellido,
        email: perfil.email,
        curso: perfil.curso
      };
      if (perfil.password) {
        datos.password = perfil.password;
      }
      const token = localStorage.getItem('token');
      const response = await fetch(`https://sistema-cisama-552k.onrender.com/usuarios/${perfil.id || ''}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setEditMode(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        
        // Actualizar localStorage y perfil solo con respuesta del backend
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setPerfil({
          nombre: updatedUser.nombre || '',
          email: updatedUser.email || '',
          rol: updatedUser.rol || '',
          foto: updatedUser.foto || 'https://randomuser.me/api/portraits/men/32.jpg',
          id: updatedUser.id || '',
          apellido: updatedUser.apellido || '',
          curso: updatedUser.curso || '',
          activo: updatedUser.activo !== undefined ? updatedUser.activo : true,
        });
      } else {
        alert('Error al guardar perfil');
      }
    } catch {
      alert('Error de conexión');
    }
  };

  return (
    <div className="crear-curso-outer d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #e3f2fd 80%, #fff 100%)' }}>
      <div className="perfil-container animate-main" style={{ background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px rgba(25, 118, 210, 0.12)', padding: '36px 32px', maxWidth: 420, width: '100%' }}>
        <div className="text-center mb-4">
          {/* Imagen decorativa de usuario neutro, siempre visible y no editable */}
          <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="Usuario neutro" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 16, background: '#e3f2fd', border: '4px solid #90caf9' }} />
          {!editMode ? (
            <>
              <h2 className="fw-bold text-primary mt-3 mb-1 animate__animated animate__fadeInDown">{perfil.nombre} {perfil.apellido}</h2>
              <h4 className="text-secondary mb-2 animate__animated animate__fadeIn">
                {perfil.rol === 'admin' ? (
                  <span style={{ color: '#1976d2', fontWeight: 'bold' }}>
                    <i className="bi bi-shield-lock-fill me-2"></i>Administrador
                  </span>
                ) : (
                  <span>{perfil.rol}</span>
                )}
              </h4>
              <div className="mb-4 animate__animated animate__fadeInUp">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-envelope-fill text-primary me-2 fs-5"></i>
                  <span className="fw-bold">{perfil.email}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-journal-bookmark-fill text-primary me-2 fs-5"></i>
                  <span className="fw-bold">{perfil.curso}</span>
                </div>
              </div>
            </>
          ) : (
            <form className="mt-3" onSubmit={handleSave}>
              <label className="form-label">Nombre</label>
              <input name="nombre" className="form-control mb-2" value={perfil.nombre} onChange={handleChange} />
              <label className="form-label">Apellido</label>
              <input name="apellido" className="form-control mb-2" value={perfil.apellido} onChange={handleChange} />
              <label className="form-label">Email</label>
              <input name="email" className="form-control mb-2" value={perfil.email} onChange={handleChange} />
              <label className="form-label">Curso</label>
              <input name="curso" className="form-control mb-2" value={perfil.curso} onChange={handleChange} />
              <label className="form-label">Contraseña</label>
              <input name="password" type="password" className="form-control mb-2" value={perfil.password} onChange={handleChange} autoComplete="new-password" placeholder="Dejar en blanco para no cambiar" />
              <div className="d-flex justify-content-center mt-4">
                <button type="submit" className="btn btn-success fw-bold w-100 animate__animated animate__pulse">
                  <i className="bi bi-save me-2"></i>Guardar
                </button>
              </div>
            </form>
          )}
        </div>
        {/* ...existing code... */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          {!editMode ? (
            <button className="btn btn-info fw-bold animate__animated animate__pulse" style={{ borderRadius: 10 }} onClick={handleEdit}>
              <i className="bi bi-pencil-square me-2"></i>Editar perfil
            </button>
          ) : null}
          {!editMode && (
            <button className="btn btn-danger fw-bold animate__animated animate__pulse" style={{ borderRadius: 10 }} onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión
            </button>
          )}
        </div>
        {showSuccess && (
          <div className="alert alert-success text-center animate__animated animate__fadeIn mt-4" role="alert" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            <i className="bi bi-check-circle me-2"></i>Perfil guardado con éxito
          </div>
        )}
      </div>
    </div>
  );
}
