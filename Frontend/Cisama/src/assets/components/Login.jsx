
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Por favor, ingresa tu correo y contraseña.');
            return;
        }
            try {
                const response = await fetch('https://sistema-cisama-552k.onrender.com/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await response.json();
                                if (response.ok && data.token) {
                                        // Limpiar todo el localStorage antes de guardar nuevos datos
                                        localStorage.clear();
                                        localStorage.setItem('token', data.token);
                                        localStorage.setItem('user', JSON.stringify({
                                            id: data.id,
                                            nombre: data.nombre,
                                            apellido: data.apellido,
                                            email: data.email,
                                            telefono: data.telefono,
                                            ciudad: data.ciudad,
                                            rol: data.rol,
                                            curso: data.curso,
                                            activo: data.activo,
                                            foto: data.foto || '',
                                        }));
                                        if (setUser) {
                                            setUser({
                                                id: data.id,
                                                nombre: data.nombre,
                                                apellido: data.apellido,
                                                email: data.email,
                                                telefono: data.telefono,
                                                ciudad: data.ciudad,
                                                rol: data.rol,
                                                curso: data.curso,
                                                activo: data.activo,
                                                foto: data.foto || '',
                                            });
                                        }
                                        setTimeout(() => {
                                            if (data.rol === 'admin' || data.rol === 'profesor' || data.rol === 'suplente') {
                                                    navigate('/main');
                                            } else {
                                                    navigate('/');
                                            }
                                        }, 300);
                                } else {
                    setError(data.error || 'Error de autenticación');
                }
            } catch (err) {
                setError('Error de conexión o del servidor');
            }
        };

        return (
            <div className="login-outer d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #e3f2fd 80%, #fff 100%)', position: 'relative' }}>
                <img src="img\Plantilla.jpg" alt="Fondo católico" style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: 0, opacity: 0.18 }} />
                <div className="login-container d-flex shadow rounded-4 overflow-hidden animate__animated animate__fadeIn" style={{ width: '420px', background: 'rgba(255,255,255,0.97)', border: '1px solid #e0e0e0', zIndex: 1 }}>
                    <div className="login-form-section d-flex flex-column align-items-center justify-content-center p-5 w-100" style={{ background: '#e3f2fd' }}>
                        <img src="../img/Vigen-Maria-Logo.jpg" alt="Logo Cisama" className="mb-3 rounded-circle shadow" style={{ width: 80, height: 80, objectFit: 'cover', border: '3px solid #1976d2' }} />
                        <h2 className="text-center mb-2 text-primary w-100 animate__animated animate__fadeInDown">Iniciar Sesión</h2>
                        <form className="login-form w-100 d-flex flex-column align-items-start animate__animated animate__fadeInUp" onSubmit={handleSubmit}>
                            <div className="mb-4 w-100">
                                <label htmlFor="email" className="form-label text-start w-100 mb-2" style={{ color: '#111' }}>Correo electrónico</label>
                                <input type="email" id="email" name="email" className="form-control text-start" placeholder="Correo" required style={{ maxWidth: '320px', color: '#111' }} value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="mb-4 w-100">
                                <label htmlFor="password" className="form-label text-start w-100 mb-2" style={{ color: '#111' }}>Contraseña</label>
                                <input type="password" id="password" name="password" className="form-control text-start" placeholder="Contraseña" required style={{ maxWidth: '320px', color: '#111' }} value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            {error && (
                                <div className="alert alert-danger w-100 text-center animate__animated animate__fadeIn mb-3" style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                    <i className="bi bi-exclamation-triangle me-2"></i>{error}
                                </div>
                            )}
                            <div className="d-flex justify-content-center w-100">
                                <button type="submit" className="btn btn-primary fw-bold mt-2 animate__animated animate__pulse" style={{ width: '200px', borderRadius: 12 }}>
                                    <i className="bi bi-box-arrow-in-right me-2"></i>Ingresar
                                </button>
                            </div>
                            {/* Enlace de recuperación de contraseña eliminado por solicitud */}
                        </form>
                    </div>
                </div>
            </div>
        );
    }

