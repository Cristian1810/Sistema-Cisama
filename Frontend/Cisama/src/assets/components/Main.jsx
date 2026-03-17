import React, { useState } from 'react';
import Cursos_Creados from './Cursos_Creados';

export default function Main({ cursosCreados = [] }) {
	const [search, setSearch] = useState("");
	return (
		<main
			className="d-flex flex-column align-items-center animate-main"
			style={{ minHeight: '100vh', width: '100%', background: 'linear-gradient(135deg, #e3f2fd 80%, #fff 100%)', padding: '40px 0' }}
		>
			<div className="mb-4">
				<img src="../img/Screenshot_2026-02-11_185435-removebg-preview.png" alt="Logo U.E Maria Virgen Misionera" style={{ width: '110px', height: '110px', objectFit: 'cover', borderRadius: '50%', boxShadow: '0 2px 12px rgba(25, 118, 210, 0.15)' }} />
			</div>
			<h1 className="display-5 fw-bold text-primary text-center mb-3 animate-title">Bienvenidos al Sistema de Creacion de Cursos Estudiantiles</h1>
			<h2 className="h4 text-secondary text-center animate-subtitle mb-4">U.E Maria Virgen Misionera</h2>

			{/* Barra de búsqueda moderna */}
			<form className="w-100 d-flex justify-content-center mb-4 animate-search" style={{ maxWidth: 420 }} onSubmit={e => e.preventDefault()}>
				<div className="input-group shadow rounded-pill overflow-hidden">
					<span className="input-group-text bg-white border-0" id="search-addon">
						<i className="bi bi-search text-primary fs-5"></i>
					</span>
					<input
						type="search"
						className="form-control border-0 bg-white px-3"
						placeholder="Buscar cursos..."
						aria-label="Buscar"
						aria-describedby="search-addon"
						style={{ borderRadius: '0 50px 50px 0', fontSize: '1.08rem' }}
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
				</div>
			</form>

			{/* Renderizar componente Cursos_Creados debajo de la barra de búsqueda */}
			<Cursos_Creados search={search} />
		</main>
	);
}

