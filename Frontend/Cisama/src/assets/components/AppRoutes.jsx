import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Aside from './Aside';
import Login from './Login';
import Registro_de_Estudiantes from './Registro_de_Estudiantes';
import Main from './Main';
import Crear_Curso from './Crear_Curso';
import Cursos_Creados from './Cursos_Creados';
import Perfil from './Perfil';
import Crear_Clase from './Crear_Clase';
import Clases from './Clases';
import Crear_Perfil from './Crear_Perfil';
import ProtectedRoute from './ProtectedRoute';
import Error404 from './Error404';

export default function AppRoutes({ user, clases, handleEditClase, handleDeleteClase, handleGuardarClase, editClaseId, setUser }) {
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
