import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/aside.css';

export default function Aside({ rol, onNav, onLogout }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleNavigate = (section) => {
    let path = '/';
    if (rol === 'admin') {
      switch (section) {
        case 'perfil': path = '/admin/perfil'; break;
        case 'main': path = '/admin/hogar'; break;
        case 'registrar': path = '/admin/registrar-alumno'; break;
        case 'crearperfil': path = '/admin/crear-perfil'; break;
        case 'crearcurso': path = '/admin/crear-curso'; break;
        case 'cursoscreados': path = '/admin/cursos-creados'; break;
        case 'clases': path = '/admin/clases'; break;
        default: path = '/admin/hogar';
      }
    } else if (rol === 'profesor' || rol === 'suplente') {
      switch (section) {
        case 'perfil': path = '/profesor/perfil'; break;
        case 'main': path = '/profesor/hogar'; break;
        case 'registrar': path = '/profesor/registrar-alumno'; break;
        case 'crearclase': path = '/profesor/crear-clase'; break;
        case 'clases': path = '/profesor/clases'; break;
        default: path = '/profesor/hogar';
      }
    }
    navigate(path);
  };

  const toggleAside = () => setOpen(prev => !prev);

  return (
    <>
      {/* Botón flotante para abrir/cerrar */}
      <button
        className={`aside-toggle-btn btn btn-primary shadow rounded-circle animate__animated animate__fadeIn ${open ? 'aside-open' : 'aside-closed'}`}
        style={{ position: 'fixed', left: open ? 320 : 16, top: 24, zIndex: 20, transition: 'left 0.4s', width: 48, height: 48 }}
        onClick={toggleAside}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      >
        <i className={`bi ${open ? 'bi-chevron-left' : 'bi-list'} fs-3`}></i>
      </button>

      <aside
        className={`aside-menu bg-light border-end shadow-sm d-flex flex-column align-items-center py-4 animate__animated ${open ? 'animate__fadeInLeft' : 'animate__fadeOutLeft'} ${open ? 'aside-open' : 'aside-closed'}`}
        style={{ width: open ? '340px' : '0', minHeight: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 10, overflow: 'hidden', transition: 'width 0.4s' }}
      >
        {open && (
          <>
            <div className="d-flex flex-column align-items-center mb-4">
              <img src="../img/Vigen-Maria-Logo.jpg" alt="Logo" className="rounded-circle shadow mb-2" style={{ width: '72px', height: '72px', objectFit: 'cover' }} />
              <h3 className="fw-bold text-center text-primary mb-0">"U.E Maria Virgen Misionera"</h3>
            </div>
            <nav className="w-100">
              <ul className="nav flex-column w-100">
                {/* Común para todos */}
                <li className="nav-item text-center mb-3">
                  <a className="nav-link text-primary d-flex flex-column align-items-center" href="javascript:void(0)" onClick={() => handleNavigate('perfil')}>
                    <i className="bi bi-person-circle fs-2 mb-1"></i>
                    <span>Ver mi perfil</span>
                  </a>
                </li>
                <li className="nav-item text-center mb-3">
                  <a className="nav-link text-primary d-flex flex-column align-items-center" href="javascript:void(0)" onClick={() => handleNavigate('main')}>
                    <i className="bi bi-house-door fs-2 mb-1"></i>
                    <span>Hogar</span>
                  </a>
                </li>
                <li className="nav-item text-center mb-3">
                  <a className="nav-link text-primary d-flex flex-column align-items-center" href="javascript:void(0)" onClick={() => handleNavigate('registrar')}>
                    <i className="bi bi-person-plus fs-2 mb-1"></i>
                    <span>Registrar alumno</span>
                  </a>
                </li>
                {/* Opciones solo para admin */}
                {rol === 'admin' && (
                  <>
                    <li className="nav-item text-center mb-3">
                      <a className="nav-link text-primary d-flex flex-column align-items-center" href="javascript:void(0)" onClick={() => handleNavigate('crearperfil')}>
                        <i className="bi bi-person-gear fs-2 mb-1"></i>
                        <span>Crear usuario</span>
                      </a>
                    </li>
                    <li className="nav-item text-center mb-3">
                      <a className="nav-link text-primary d-flex flex-column align-items-center" href="javascript:void(0)" onClick={() => handleNavigate('crearcurso')}>
                        <i className="bi bi-plus-circle fs-2 mb-1"></i>
                        <span>Crear curso</span>
                      </a>
                    </li>
                    <li className="nav-item text-center mb-3">
                      <a className="nav-link text-primary d-flex flex-column align-items-center" href="javascript:void(0)" onClick={() => handleNavigate('cursoscreados')}>
                        <i className="bi bi-journal-bookmark fs-2 mb-1"></i>
                        <span>Cursos creados</span>
                      </a>
                    </li>
                    <li className="nav-item text-center mb-3">
                      <a className="nav-link text-primary d-flex flex-column align-items-center" href="javascript:void(0)" onClick={() => handleNavigate('clases')}>
                        <i className="bi bi-list-check fs-2 mb-1"></i>
                        <span>Clases guardadas</span>
                      </a>
                    </li>
                  </>
                )}
                {/* Opciones solo para profesor/suplente */}
                {(rol === 'profesor' || rol === 'suplente') && (
                  <>
                    <li className="nav-item text-center mb-3">
                      <a className="nav-link text-primary d-flex flex-column align-items-center" href="javascript:void(0)" onClick={() => handleNavigate('crearclase')}>
                        <i className="bi bi-calendar-plus fs-2 mb-1"></i>
                        <span>Crear Clase</span>
                      </a>
                    </li>
                    <li className="nav-item text-center mb-3">
                      <a className="nav-link text-primary d-flex flex-column align-items-center" href="javascript:void(0)" onClick={() => handleNavigate('clases')}>
                        <i className="bi bi-list-check fs-2 mb-1"></i>
                        <span>Clases guardadas</span>
                      </a>
                    </li>
                  </>
                )}
                {/* Cerrar sesión */}
                <li className="nav-item text-center">
                  <a className="nav-link text-primary d-flex flex-column align-items-center" href="javascript:void(0)" onClick={onLogout}>
                    <i className="bi bi-box-arrow-right fs-2 mb-1"></i>
                    <span>Cerrar Sesión</span>
                  </a>
                </li>
              </ul>
            </nav>
          </>
        )}
      </aside>
    </>
  );
}