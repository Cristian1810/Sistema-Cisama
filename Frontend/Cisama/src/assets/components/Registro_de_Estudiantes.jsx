import React, { useState, useEffect } from 'react';
import '../Css/Registro_de_Estudiantes.css';

export default function Registro_de_Estudiantes() {
       // Estado para el formulario
       const [form, setForm] = useState({
	       nombre: '',
	       apellido: '',
	       grado: '',
	       seccion: '',
	       curso_id: '',
	       turno: '',
	       horaEntrada: '',
	       horaSalida: '',
	       telefono: ''
       });

       // Estado para cursos
       const [cursos, setCursos] = useState([]);

       // Estado para alertas
       const [showAlert, setShowAlert] = useState(false);
       const [alertMsg, setAlertMsg] = useState('');

       // Obtener cursos al montar
	       useEffect(() => {
		       const token = localStorage.getItem('token');
			   fetch('https://sistema-cisama-552k.onrender.com/cursos', {
		         headers: {
		           'Content-Type': 'application/json',
		           ...(token ? { 'Authorization': `Bearer ${token}` } : {})
		         }
		       })
			       .then(res => res.json())
			       .then(data => setCursos(data))
			       .catch(() => setCursos([]));
	       }, []);

       // Manejar cambios en el formulario
       const handleChange = e => {
	       const { name, value } = e.target;
	       setForm(prev => ({ ...prev, [name]: value }));
       };

       // Manejar envío del formulario
       const handleSubmit = e => {
       e.preventDefault();
		   const token = localStorage.getItem('token');
		   fetch('https://sistema-cisama-552k.onrender.com/estudiantes', {
	       method: 'POST',
	       headers: {
	         'Content-Type': 'application/json',
	         ...(token ? { 'Authorization': `Bearer ${token}` } : {})
	       },
	       body: JSON.stringify(form)
	       })
		       .then(res => {
			       if (res.ok) {
				       setAlertMsg('Estudiante registrado exitosamente');
				       setShowAlert(true);
				       setForm({
					       nombre: '',
					       apellido: '',
					       grado: '',
					       seccion: '',
					       curso_id: '',
					       turno: '',
					       horaEntrada: '',
					       horaSalida: '',
					       telefono: ''
				       });
				       setTimeout(() => setShowAlert(false), 2500);
			       } else {
				       setAlertMsg('Error al registrar estudiante');
				       setShowAlert(true);
				       setTimeout(() => setShowAlert(false), 2500);
			       }
		       })
		       .catch(() => {
			       setAlertMsg('Error de conexi\u00f3n');
			       setShowAlert(true);
			       setTimeout(() => setShowAlert(false), 2500);
		       });
       };

       return (
	       <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f9fa' }}>
		       <div className="registro-container">
			       <h2>Registro de Estudiantes</h2>
			       {showAlert && (
				       <div className="alert alert-success text-center animate__animated animate__fadeIn" role="alert" style={{
					       fontWeight: 'bold',
					       fontSize: '1.1rem',
					       marginBottom: 24,
					       background: '#fff',
					       color: '#1976d2',
					       border: '1px solid #1976d2',
					       borderRadius: 12,
					       boxShadow: '0 4px 16px rgba(25,118,210,0.10)',
					       position: 'fixed',
					       top: '50%',
					       left: '50%',
					       transform: 'translate(-50%, -50%)',
					       zIndex: 9999,
					       minWidth: 320,
					       maxWidth: 420
				       }}>
					       <i className="bi bi-check-circle me-2"></i>{alertMsg}
				       </div>
			       )}
				       <form className="registro-form" onSubmit={handleSubmit}>
					       {/* Fila 1: Datos personales */}
					       <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
						       <div style={{ flex: 1 }}>
							       <label className="form-label">Nombre</label>
							       <input type="text" className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
						       </div>
						       <div style={{ flex: 1 }}>
							       <label className="form-label">Apellido</label>
							       <input type="text" className="form-control" name="apellido" value={form.apellido} onChange={handleChange} required />
						       </div>
						       <div style={{ flex: 1 }}>
							       <label className="form-label">Número de Teléfono</label>
							       <input type="tel" className="form-control" name="telefono" value={form.telefono} onChange={handleChange} required />
						       </div>
					       </div>
					       {/* Fila 2: Datos académicos */}
					       <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
						       <div style={{ flex: 1 }}>
							       <label className="form-label">Grado</label>
							       <input type="text" className="form-control" name="grado" value={form.grado} onChange={handleChange} required />
						       </div>
						       <div style={{ flex: 1 }}>
							       <label className="form-label">Sección</label>
							       <input type="text" className="form-control" name="seccion" value={form.seccion} onChange={handleChange} required />
						       </div>
							       <div style={{ flex: 1 }}>
								       <label className="form-label">Curso</label>
								       <select className="form-control" name="curso_id" value={form.curso_id} onChange={handleChange} required>
									       <option value="">Seleccione un curso</option>
									       <optgroup label="Cursos de Mañana">
										       {cursos && cursos.filter(c => c.horario && c.horario.toLowerCase().includes('mañana')).map(curso => (
											       <option key={curso.id} value={curso.id}>{curso.titulo} (Mañana)</option>
										       ))}
									       </optgroup>
									       <optgroup label="Cursos de Tarde">
										       {cursos && cursos.filter(c => c.horario && c.horario.toLowerCase().includes('tarde')).map(curso => (
											       <option key={curso.id} value={curso.id}>{curso.titulo} (Tarde)</option>
										       ))}
									       </optgroup>
								       </select>
							       </div>
					       </div>
					       {/* Fila 3: Turno y horas */}
					       <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
						       <div style={{ flex: 1 }}>
							       <label className="form-label">Turno</label>
							       <select className="form-control" name="turno" value={form.turno} onChange={handleChange} required>
								       <option value="">Seleccione un turno</option>
								       <option value="Mañana">Mañana</option>
								       <option value="Tarde">Tarde</option>
							       </select>
						       </div>
						       <div style={{ flex: 1 }}>
							       <label className="form-label">Hora de Entrada</label>
							       <input type="time" className="form-control" name="horaEntrada" value={form.horaEntrada} onChange={handleChange} required />
						       </div>
						       <div style={{ flex: 1 }}>
							       <label className="form-label">Hora de Salida</label>
							       <input type="time" className="form-control" name="horaSalida" value={form.horaSalida} onChange={handleChange} required />
						       </div>
					       </div>
					       <div style={{ textAlign: 'center', marginTop: 32 }}>
						       <button type="submit" className="btn btn-primary" style={{ minWidth: 200, fontSize: '1.1rem', fontWeight: 'bold' }}>Registrar</button>
					       </div>
				       </form>
		       </div>
	       </div>
       );
}
