import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Aside from './Aside';
import AppRoutes from './AppRoutes';

export default function AppContent() {
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
			await fetch(`https://sistema-cisama-552k.onrender.com/clases/${editClaseId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(clase)
			});
			setEditClaseId(null);
		} else {
			await fetch('https://sistema-cisama-552k.onrender.com/clases', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(clase)
			});
		}
		await fetchClases();
		if (user?.rol === 'profesor' || user?.rol === 'suplente') {
			if (window.location.pathname !== '/profesor/clases') {
				navigate('/profesor/clases');
			}
		} else if (user?.rol === 'admin') {
			if (window.location.pathname !== '/admin/clases') {
				navigate('/admin/clases');
			}
		}
	};

	const fetchClases = async () => {
		const token = localStorage.getItem('token');
		try {
			const res = await fetch('https://sistema-cisama-552k.onrender.com/clases', {
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
		await fetch(`https://sistema-cisama-552k.onrender.com/clases/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				...(token ? { 'Authorization': `Bearer ${token}` } : {})
			}
		});
		await fetchClases();
		if (user?.rol === 'profesor' || user?.rol === 'suplente') {
			if (window.location.pathname !== '/profesor/clases') {
				navigate('/profesor/clases');
			}
		} else if (user?.rol === 'admin') {
			if (window.location.pathname !== '/admin/clases') {
				navigate('/admin/clases');
			}
		}
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
