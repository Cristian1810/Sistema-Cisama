import React from 'react';

export default function Error404() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#1976d2' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 700 }}>404</h1>
      <h2 style={{ fontWeight: 500 }}>Página no encontrada</h2>
      <p>La ruta que buscas no existe o no tienes permisos para acceder.</p>
      <a href="/" style={{ color: '#1976d2', textDecoration: 'underline', marginTop: 16 }}>Volver al inicio</a>
    </div>
  );
}
