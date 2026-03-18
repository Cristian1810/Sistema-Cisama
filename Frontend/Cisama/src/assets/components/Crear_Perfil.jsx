import React, { useState, useEffect } from 'react';
import '../Css/crear_perfil.css';

const roles = [
  { value: 'profesor', label: 'Profesor' },
  { value: 'suplente', label: 'Suplente' }
];

export default function Crear_Perfil() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    curso: '',
    rol: '',
    password: '',
    activo: true
  });
  const [editIdx, setEditIdx] = useState(null);
  const [editAnim, setEditAnim] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  // Función para cargar usuarios con token
  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      
    }
  };

  useEffect(() => {
    fetchUsuarios();
    const token = localStorage.getItem('token');
    fetch(`${import.meta.env.VITE_API_URL}/cursos`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    })
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(() => setCursos([]));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'activo' ? value === 'true' : value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Validaciones básicas
    if (!form.nombre || !form.apellido || !form.email || !form.rol) {
      alert('Completa todos los campos obligatorios');
      return;
    }
    // Si es estudiante, el curso es obligatorio
    if (form.rol === 'estudiante' && !form.curso) {
      alert('Debes seleccionar un curso para el estudiante');
      return;
    }
    try {
      if (editIdx !== null) {
        // Editar usuario
        const usuarioEdit = usuarios[editIdx];
        const token = localStorage.getItem('token');
        // Si el campo password está vacío, no lo envíes en el body
        const formToSend = { ...form };
        if (!formToSend.password) {
          delete formToSend.password;
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${usuarioEdit.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formToSend)
        });
        if (response.ok) {
          setEditIdx(null);
          setForm({ nombre: '', apellido: '', email: '', curso: '', rol: '', password: '', activo: true });
          setAlertMsg('Usuario editado con éxito');
          setShowAlert(true);
          await fetchUsuarios();
          setTimeout(() => setShowAlert(false), 5000);
        }
      } else {
        // Crear usuario
        if (!form.password) {
          alert('La contraseña es obligatoria para crear un usuario');
          return;
        }
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(form)
        });
        if (response.ok) {
          setForm({ nombre: '', apellido: '', email: '', curso: '', rol: '', password: '', activo: true });
          setAlertMsg('Usuario creado correctamente');
          setShowAlert(true);
          await fetchUsuarios();
          setTimeout(() => setShowAlert(false), 5000);
        }
      }
    } catch (error) {
      alert('Error al guardar usuario');
    }
  };

  const handleEdit = idx => {
    setEditIdx(idx);
    setForm({
      nombre: usuarios[idx].nombre || '',
      apellido: usuarios[idx].apellido || '',
      email: usuarios[idx].email || '',
      curso: usuarios[idx].curso || '',
      rol: usuarios[idx].rol || '',
      password: '', // No obligar a cambiar contraseña
      activo: usuarios[idx].activo !== undefined ? usuarios[idx].activo : true
    });
    setEditAnim(true);
    setTimeout(() => setEditAnim(false), 400);
  };

  const handleDisable = async idx => {
    const usuario = usuarios[idx];
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${usuario.id}/disable`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        await fetchUsuarios();
      }
    } catch (error) {
      alert('Error al deshabilitar usuario');
    }
  };

  const handleEnable = async idx => {
    const usuario = usuarios[idx];
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${usuario.id}/enable`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        await fetchUsuarios();
      }
    } catch (error) {
      alert('Error al habilitar usuario');
    }
  };

  const handleDelete = async idx => {
    const usuario = usuarios[idx];
    if (usuario.rol === 'admin') {
      setAlertMsg('No puedes eliminar el usuario administrador');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2500);
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${usuario.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        await fetchUsuarios();
      }
    } catch (error) {
      alert('Error al eliminar usuario');
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#f7f9fa', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '48px 0' }}>
      <div className="crear-perfil-container" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: 48,
        width: '100%',
        maxWidth: 1200,
        background: 'rgba(255,255,255,0.98)',
        borderRadius: 24,
        boxShadow: '0 4px 24px rgba(25,118,210,0.10)',
        padding: 40,
        alignItems: 'flex-start',
      }}>
        <div>
          <h2 className="crear-perfil-titulo" style={{textAlign: 'center'}}>Crear Usuario</h2>
          <form className={`crear-perfil-form${editAnim ? ' anim-up' : ''}`} onSubmit={handleSubmit} style={{maxWidth: 420, margin: '0 auto'}}>
            {showAlert && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            minWidth: 320,
            maxWidth: 480,
            padding: '24px 32px',
            background: '#e3f2fd',
            color: '#1976d2',
            border: '2px solid #1976d2',
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(25,118,210,0.18)',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            textAlign: 'center',
            animation: 'fadeIn 0.5s',
          }}
            className="alert animate__animated animate__fadeIn"
            role="alert"
          >
            <i className="bi bi-check-circle me-2"></i>{alertMsg}
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input type="text" name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input type="text" name="apellido" className="form-control" value={form.apellido} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required placeholder="correo@ejemplo.com" style={{ maxWidth: '320px', color: '#111' }} />
        </div>
        <div className="mb-3">
          <label className="form-label">Curso <span style={{ color: '#888', fontWeight: 'normal', fontSize: '0.95em' }}>(opcional para profesores/suplentes)</span></label>
          <select className="form-control" name="curso" value={form.curso} onChange={handleChange} disabled={form.rol === 'profesor' || form.rol === 'suplente'}>
            <option value="">Seleccione un curso</option>
            {Array.isArray(cursos) && cursos.map(curso => (
              <option key={curso.id} value={curso.titulo}>{curso.titulo}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select name="rol" className="form-control" value={form.rol} onChange={handleChange} required>
            <option value="">Selecciona rol</option>
            {roles.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña {editIdx !== null && <span style={{color:'#888',fontWeight:'normal',fontSize:'0.95em'}}>(deja en blanco para no cambiarla)</span>}</label>
          <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required={editIdx === null} />
        </div>
        <div className="mb-3">
          <label className="form-label">Estado</label>
          <select name="activo" className="form-control" value={form.activo} onChange={handleChange} required>
            <option value={true}>Activo</option>
            <option value={false}>Inactivo</option>
          </select>
        </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary fw-bold" style={{width: 180, borderRadius: 12}}>
                {editIdx !== null ? 'Guardar Cambios' : 'Crear Usuario'}
              </button>
            </div>
          </form>
        </div>
        <div>
          <h3 className="crear-perfil-subtitulo text-center mb-4" style={{ fontWeight: 'bold', color: '#1976d2', letterSpacing: '1px' }}>Usuarios creados</h3>
          <ul className="crear-perfil-lista" style={{ listStyle: 'none', padding: 0, maxWidth: 520, margin: '0 auto' }}>
            {usuarios.map((u, idx) => (
              <li
                key={idx}
                className="crear-perfil-item animate__animated animate__fadeIn"
                style={{
                  background: u.activo ? 'linear-gradient(135deg, #e3f2fd 80%, #fff 100%)' : 'linear-gradient(135deg, #bdbdbd 80%, #fff 100%)',
                  borderRadius: '18px',
                  marginBottom: '18px',
                  padding: '18px 24px',
                  boxShadow: '0 4px 16px rgba(25,118,210,0.10)',
                  border: u.activo ? '2px solid #1976d2' : '2px solid #bdbdbd',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'background 0.3s, border 0.3s',
                }}
              >
                <div className="mb-2 text-center">
                  <strong className="fs-5 text-primary">{u.nombre} {u.apellido}</strong>
                  <span className="ms-2 badge bg-info text-dark">{u.email}</span>
                </div>
                <div className="mb-2 text-center text-secondary" style={{ fontSize: '1.08rem' }}>
                  Curso: <span className="fw-bold">{u.curso}</span> | Rol: <span className="fw-bold">{roles.find(r => r.value === u.rol)?.label || u.rol}</span>
                </div>
                <div className="crear-perfil-actions d-flex justify-content-center" style={{ marginTop: '8px', gap: '12px' }}>
              <button className="btn btn-primary btn-sm shadow" onClick={() => handleEdit(idx)}>
                <i className="bi bi-pencil-square"></i> Editar
              </button>
              <button className="btn btn-danger btn-sm shadow" onClick={() => handleDisable(idx)} disabled={!u.activo}>
                <i className="bi bi-x-circle"></i> Deshabilitar
              </button>
              <button className="btn btn-success btn-sm shadow" onClick={() => handleEnable(idx)} disabled={u.activo}>
                <i className="bi bi-check-circle"></i> Habilitar
              </button>
              {u.rol !== 'admin' && (
                <button className="btn btn-outline-danger btn-sm shadow" onClick={() => handleDelete(idx)}>
                  <i className="bi bi-trash"></i> Eliminar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      </div>
    </div>
  </div>
  );
}