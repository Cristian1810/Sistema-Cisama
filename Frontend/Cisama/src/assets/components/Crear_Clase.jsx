import React, { useState, useEffect } from 'react';
import '../Css/crear_clase.css';

export default function Crear_Clase({ onGuardar, claseEdit }) {
	const [form, setForm] = useState({
		fecha: '',
		titulo: '',
		curso_id: '',
		horaEntrada: '',
		horaSalida: '',
		turno: '',
		observaciones: '',
		asistencia: []
	});
	// Cuando claseEdit cambia, cargar datos en el formulario
	useEffect(() => {
		if (claseEdit) {
			setForm({
				fecha: claseEdit.fecha || '',
				titulo: claseEdit.titulo || '',
				curso_id: claseEdit.curso_id || '',
				horaEntrada: claseEdit.hora_entrada || claseEdit.horaEntrada || '',
				horaSalida: claseEdit.hora_salida || claseEdit.horaSalida || '',
				turno: claseEdit.turno || '',
				observaciones: claseEdit.observaciones || '',
				asistencia: Array.isArray(claseEdit.asistencia)
					? claseEdit.asistencia.map(a => ({
						id: a.id,
						presente: a.presente,
						nombre: a.nombre || ''
					}))
					: []
			});
		}
	}, [claseEdit]);
	const [cursos, setCursos] = useState([]);
	const [cursoActivo, setCursoActivo] = useState(null);
	const [alumnos, setAlumnos] = useState([]);

	// Obtener cursos al cargar
	useEffect(() => {
		const token = localStorage.getItem('token');
		fetch(`${import.meta.env.VITE_API_URL}/cursos`, {
			headers: {
				'Content-Type': 'application/json',
				...(token ? { 'Authorization': `Bearer ${token}` } : {})
			}
		})
			.then(res => res.json())
			.then(data => {
				if (Array.isArray(data)) {
					setCursos(data);
				} else {
					setCursos([]);
				}
			})
			.catch(() => setCursos([]));
	}, []);

	// Revisar si el curso seleccionado está activo o no
	useEffect(() => {
		if (form.curso_id && Array.isArray(cursos) && cursos.length > 0) {
			const cursoSel = cursos.find(c => String(c.id) === String(form.curso_id));
			setCursoActivo(cursoSel);
		} else {
			setCursoActivo(null);
		}
	}, [form.curso_id, cursos]);

	// Obtener alumnos cuando se selecciona curso y hora
	useEffect(() => {
		if (form.curso_id && form.horaEntrada && form.horaSalida) {
			const token = localStorage.getItem('token');
			fetch(`${import.meta.env.VITE_API_URL}/estudiantes`, {
				headers: {
					'Content-Type': 'application/json',
					...(token ? { 'Authorization': `Bearer ${token}` } : {})
				}
			})
				.then(res => res.json())
				.then(data => {
					// Filtrar alumnos por curso y hora (solo HH:mm)
					const getHora = h => h ? h.slice(0,5) : '';
					const alumnosFiltrados = Array.isArray(data)
						? data.filter(a =>
							Number(a.curso_id) === Number(form.curso_id) &&
							getHora(a.horaEntrada || a.hora_entrada) <= form.horaEntrada &&
							getHora(a.horaSalida || a.hora_salida) >= form.horaSalida
						)
						: [];
					setAlumnos(alumnosFiltrados);
					// Si estamos editando, no sobrescribir asistencia
					if (!claseEdit) {
						setForm(f => ({
							...f,
							asistencia: alumnosFiltrados.map(a => ({ id: a.id, presente: false, nombre: a.nombre + ' ' + a.apellido }))
						}));
					}
				})
				.catch(() => {
					setAlumnos([]);
					if (!claseEdit) {
						setForm(f => ({ ...f, asistencia: [] }));
					}
				});
		} else {
			setAlumnos([]);
			if (!claseEdit) {
				setForm(f => ({ ...f, asistencia: [] }));
			}
		}
	}, [form.curso_id, form.horaEntrada, form.horaSalida, claseEdit]);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleAsistencia = (id, presente) => {
		setForm({
			...form,
			asistencia: form.asistencia.map(a =>
				a.id === id ? { ...a, presente } : a
			)
		});
	};

	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMsg('');
		try {
			// Validar campos obligatorios
			if (!form.fecha || !form.titulo || !form.curso_id || !form.horaEntrada || !form.horaSalida || !form.turno) {
				setErrorMsg('Completa todos los campos obligatorios');
				return;
			}
			// Validar asistencia
			if (!form.asistencia || form.asistencia.length === 0) {
				setErrorMsg('Debe haber al menos un alumno en la asistencia');
				return;
			}
			// Guardar clase directamente con token
			const claseData = {
				...form,
				curso_id: Number(form.curso_id)
			};
			const token = localStorage.getItem('token');
			const url = claseEdit && claseEdit.id ? `${import.meta.env.VITE_API_URL}/clases/${claseEdit.id}` : `${import.meta.env.VITE_API_URL}/clases`;
			const method = claseEdit && claseEdit.id ? 'PUT' : 'POST';
			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(claseData)
			});
			if (!response.ok) {
				setErrorMsg('Error al guardar la clase');
				return;
			}
			setSuccessMsg('Clase guardada con éxito, consulta en tus clases guardadas');
			setTimeout(() => setSuccessMsg(''), 5000);
			// Limpiar formulario
			setForm({
				fecha: '',
				titulo: '',
				curso_id: '',
				horaEntrada: '',
				horaSalida: '',
				turno: '',
				observaciones: '',
				asistencia: []
			});
			setErrorMsg('');
		} catch (err) {
			setErrorMsg('Error de conexión');
		}
	};

	return (
		<div className="crear-clase-container" style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			minHeight: '100vh',
			width: '100vw',
			background: '#9cd5f1',
		}}>
			<h2 className="crear-clase-titulo">Crear Clase</h2>
			{/* Aviso visual de estado del curso */}
			{cursoActivo && cursoActivo.activo === false && (
				<div className="alert alert-danger text-center animate__animated animate__fadeIn" style={{marginBottom: 16, borderRadius: 12, fontWeight: 'bold'}}>
					<i className="bi bi-x-octagon me-2"></i>Este curso está <b>desactivado</b>. No puedes crear clases hasta que sea reactivado.
				</div>
			)}
			{cursoActivo && cursoActivo.activo === true && (
				<div className="alert alert-success text-center animate__animated animate__fadeIn" style={{marginBottom: 16, borderRadius: 12, fontWeight: 'bold'}}>
					<i className="bi bi-check-circle me-2"></i>Este curso está <b>activo</b>. Puedes crear clases normalmente.
				</div>
			)}
			{errorMsg && (
				<div className="alert alert-danger text-center animate__animated animate__fadeIn" style={{marginBottom: 16, borderRadius: 12}}>
					<i className="bi bi-exclamation-triangle me-2"></i>{errorMsg}
				</div>
			)}
			{successMsg && (
				<div className="alert alert-success animate__animated animate__fadeIn" role="alert" style={{
					fontWeight: 'bold',
					fontSize: '1.1rem',
					background: '#fff',
					color: '#1976d2',
					border: '1px solid #1976d2',
					borderRadius: 12,
					boxShadow: '0 4px 16px rgba(25,118,210,0.10)',
					position: 'fixed',
					top: '24px',
					left: '50%',
					transform: 'translateX(-50%)',
					zIndex: 9999,
					minWidth: 320,
					maxWidth: 420
				}}>
					<i className="bi bi-check-circle me-2"></i>{successMsg}
				</div>
			)}
			<form className="crear-clase-form" onSubmit={handleSubmit} style={{
				width: '100%',
				maxWidth: 700,
				background: '#fff',
				borderRadius: 16,
				boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
				padding: 32,
				margin: '0 auto',
			}}>
				<div className="crear-clase-grid">
					<div className="crear-clase-col1">
						<div className="mb-3">
							<label className="form-label">Fecha</label>
							<input type="date" className="form-control" name="fecha" value={form.fecha} onChange={handleChange} required />
						</div>
						<div className="mb-3">
							<label className="form-label">Título de la clase</label>
							<input type="text" className="form-control" name="titulo" value={form.titulo} onChange={handleChange} required />
						</div>
						<div className="mb-3">
							<label className="form-label">Curso</label>
							<select className="form-control" name="curso_id" value={form.curso_id} onChange={handleChange} required>
								<option value="">Selecciona curso</option>
								<optgroup label="Cursos de Mañana">
									{cursos.filter(c => c.horario && c.horario.toLowerCase().includes('mañana')).map(curso => (
										<option key={curso.id} value={curso.id}>{curso.titulo} (Mañana)</option>
									))}
								</optgroup>
								<optgroup label="Cursos de Tarde">
									{cursos.filter(c => c.horario && c.horario.toLowerCase().includes('tarde')).map(curso => (
										<option key={curso.id} value={curso.id}>{curso.titulo} (Tarde)</option>
									))}
								</optgroup>
								{cursos.filter(c => !c.horario).map(curso => (
									<option key={curso.id} value={curso.id}>{curso.titulo}</option>
								))}
							</select>
						</div>
						<div className="mb-3">
							<label className="form-label">Hora de entrada</label>
							<input type="time" className="form-control" name="horaEntrada" value={form.horaEntrada} onChange={handleChange} required />
						</div>
						<div className="mb-3">
							<label className="form-label">Hora de salida</label>
							<input type="time" className="form-control" name="horaSalida" value={form.horaSalida} onChange={handleChange} required />
						</div>
						<div className="mb-3">
							<label className="form-label">Turno</label>
							<select className="form-control" name="turno" value={form.turno} onChange={handleChange} required>
								<option value="">Selecciona turno</option>
								<option value="mañana">Mañana</option>
								<option value="tarde">Tarde</option>
							</select>
						</div>
						<div className="mb-3">
							<label className="form-label">Observaciones</label>
							<textarea className="form-control" name="observaciones" value={form.observaciones} onChange={handleChange} rows={3} />
						</div>
					</div>
					<div className="crear-clase-col2">
						<div className="mb-3">
							<label className="form-label">Lista de alumnos y asistencia</label>
							<ul className="lista-alumnos">
								{form.asistencia.length === 0 && <li className="text-muted">Selecciona curso y hora para ver alumnos.</li>}
								{form.asistencia.map(alumno => (
									<li key={alumno.id} className="alumno-item">
										<span>{alumno.nombre}</span>
										<select
											value={alumno.presente ? 'asistente' : 'inasistente'}
											onChange={e => handleAsistencia(alumno.id, e.target.value === 'asistente')}
											className="form-select form-select-sm"
											style={{ width: 120, marginLeft: 12 }}
										>
											<option value="asistente">Asistente</option>
											<option value="inasistente">Inasistente</option>
										</select>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
				<div style={{ width: '100%', textAlign: 'center', marginTop: 24 }}>
					<button
						type="submit"
						className="btn btn-primary fw-bold"
						disabled={cursoActivo && cursoActivo.activo === false}
					>
						Guardar Clase
					</button>
				</div>
			</form>
		</div>
	);
}
