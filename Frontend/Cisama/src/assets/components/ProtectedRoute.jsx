import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) {
    // No autenticado
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // Rol no permitido
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;
