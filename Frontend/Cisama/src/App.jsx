import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Aside from './assets/components/Aside';
import Login from './assets/components/Login';
import Registro_de_Estudiantes from './assets/components/Registro_de_Estudiantes';
import Main from './assets/components/Main';
import Crear_Curso from './assets/components/Crear_Curso';
import Cursos_Creados from './assets/components/Cursos_Creados';
import Perfil from './assets/components/Perfil';
import Crear_Clase from './assets/components/Crear_Clase';
import Clases from './assets/components/Clases';
import Crear_Perfil from './assets/components/Crear_Perfil';
import ProtectedRoute from './assets/components/ProtectedRoute';
import Error404 from './assets/components/Error404';

 function AppRoutes({ user, clases, handleEditClase, handleDeleteClase, handleGuardarClase, editClaseId, setUser }) {
  return (
    <Routes>
      <Route path="/main" element={
        <ProtectedRoute user={user} allowedRoles={["admin", "profesor", "suplente"]}>
          <Main />
        </ProtectedRoute>
      } />
      <Route path="/login" element={<Login setUser={setUser} />} />
      {/* Rutas para Admin */}
      <Route path="/admin/perfil" element={
        <ProtectedRoute user={user} allowedRoles={["admin"]}>
          <Perfil />
        </ProtectedRoute>
      } />
      <Route path="/admin/hogar" element={
        <ProtectedRoute user={user} allowedRoles={["admin"]}>
          <Main />
        </ProtectedRoute>
      } />
      <Route path="/admin/registrar-alumno" element={
        <ProtectedRoute user={user} allowedRoles={["admin"]}>
          <Registro_de_Estudiantes />
        </ProtectedRoute>
      } />
      <Route path="/admin/crear-curso" element={
        <ProtectedRoute user={user} allowedRoles={["admin"]}>
          <Crear_Curso />
        </ProtectedRoute>
      } />
      <Route path="/admin/cursos-creados" element={
        <ProtectedRoute user={user} allowedRoles={["admin"]}>
          <Cursos_Creados />
        </ProtectedRoute>
      } />
      <Route path="/admin/clases" element={
        <ProtectedRoute user={user} allowedRoles={["admin"]}>
          <Clases key={clases.length} clases={clases} onEdit={handleEditClase} onDelete={handleDeleteClase} rol={user?.rol} />
        </ProtectedRoute>
      } />
      <Route path="/admin/crear-perfil" element={
        <ProtectedRoute user={user} allowedRoles={["admin"]}>
          <Crear_Perfil />
        </ProtectedRoute>
      } />
      <Route path="/admin/cerrar-sesion" element={<Login setUser={setUser} />} />
      {/* Rutas para Profesor/Suplente */}
      <Route path="/profesor/perfil" element={
        <ProtectedRoute user={user} allowedRoles={["profesor", "suplente"]}>
          <Perfil />
        </ProtectedRoute>
      } />
      <Route path="/profesor/hogar" element={
        <ProtectedRoute user={user} allowedRoles={["profesor", "suplente"]}>
          <Main />
        </ProtectedRoute>
      } />
      <Route path="/profesor/registrar-alumno" element={
        <ProtectedRoute user={user} allowedRoles={["profesor", "suplente"]}>
          <Registro_de_Estudiantes />
        </ProtectedRoute>
      } />
      <Route path="/profesor/crear-clase" element={
        <ProtectedRoute user={user} allowedRoles={["profesor", "suplente"]}>
          <Crear_Clase onGuardar={handleGuardarClase} claseEdit={editClaseId ? clases.find(c => c.id === editClaseId) : null} />
        </ProtectedRoute>
      } />
      <Route path="/profesor/clases" element={
        <ProtectedRoute user={user} allowedRoles={["profesor", "suplente"]}>
          <Clases key={clases.length} clases={clases} onEdit={handleEditClase} onDelete={handleDeleteClase} rol={user?.rol} />
        </ProtectedRoute>
      } />
      <Route path="/profesor/cerrar-sesion" element={<Login setUser={setUser} />} />
      <Route path="/" element={<Login setUser={setUser} />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

function AppContent() {
  const [view, setView] = useState('main');
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [clases, setClases] = useState([]);
  const [editClaseId, setEditClaseId] = useState(null);
  const navigate = useNavigate();

  // Detectar expiración de sesión (token JWT)
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          // Token expirado
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          navigate('/login');
        }
      } catch (e) {
        // Token inválido
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
      }
    }
  }, [user, navigate]);

  const handleNav = (section) => setView(section);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('login');
    navigate('/login');
  };

  const handleGuardarClase = async (clase) => {
    const token = localStorage.getItem('token');
    if (editClaseId) {
      await fetch(`http://localhost:3000/clases/${editClaseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(clase)
      });
      setEditClaseId(null);
    } else {
      await fetch('http://localhost:3000/clases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(clase)
      });
    }
    await fetchClases();
    setView('clases');
    if (user?.rol === 'profesor' || user?.rol === 'suplente') {
      navigate('/profesor/clases');
    } else if (user?.rol === 'admin') {
      navigate('/admin/clases');
    }
  };

  const fetchClases = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/clases', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        setClases([]);
        return;
      }
      const data = await res.json();
      setClases(Array.isArray(data) ? data : []);
    } catch (error) {
      setClases([]);
    }
  };

  React.useEffect(() => {
    fetchClases();
  }, [user]);

  const handleEditClase = (idx) => {
    setEditClaseId(clases[idx].id);
    if (user?.rol === 'profesor' || user?.rol === 'suplente') {
      navigate('/profesor/crear-clase');
    } else if (user?.rol === 'admin') {
      navigate('/admin/crearclase');
    }
  };

  const handleDeleteClase = async (idx) => {
    const id = clases[idx].id;
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:3000/clases/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    await fetchClases();
  };

  // Detectar si estamos en la ruta de login
  const isLoginPage = window.location.pathname === '/login' || window.location.pathname === '/';
  return (
    <>
      {user && !isLoginPage && (
        <Aside
          rol={user.rol}
          onNav={handleNav}
          onLogout={handleLogout}
        />
      )}
      <AppRoutes
        user={user}
        clases={clases}
        handleEditClase={handleEditClase}
        handleDeleteClase={handleDeleteClase}
        handleGuardarClase={handleGuardarClase}
        editClaseId={editClaseId}
        setUser={setUser}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

