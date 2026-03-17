import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Error404() {
  const navigate = useNavigate();
  const handleLoginRedirect = () => {
    navigate('/login');
  };
  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#1976d2', position: 'fixed', top: 0, left: 0 }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 700 }}>404</h1>
      <h2 style={{ fontWeight: 500 }}>Página no encontrada</h2>
      <p>La ruta que buscas no existe o no tienes permisos para acceder.</p>
      <a href="/" style={{ color: '#1976d2', textDecoration: 'underline', marginTop: 16 }}>Volver al inicio</a>
      <button onClick={handleLoginRedirect} style={{ marginTop: 24, padding: '10px 24px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 16 }}>
        Ir al Login
      </button>
    </div>
  );
}
