import React from 'react';
import '../Css/clases.css';

export default function Clases({ clases, onEdit, onDelete, rol }) {
    // Función para formatear fecha
    const formatFecha = fecha => {
        const d = new Date(fecha);
        const dia = d.getDate().toString().padStart(2, '0');
        const mes = (d.getMonth() + 1).toString().padStart(2, '0');
        const año = d.getFullYear();
        return `${dia}/${mes}/${año}`;
    };
    // Función para formatear hora
    const formatHora = hora => hora ? hora.slice(0,5) : '';

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fcfcfc 80%, #ffffff 100%)',
            padding: '40px 0',
            boxSizing: 'border-box',
        }}>
            <div className="clases-container" style={{
                width: '100%',
                maxWidth: 1200,
                margin: '0 auto',
                background: '#fff',
                borderRadius: 18,
                boxShadow: '0 4px 16px rgba(25, 118, 210, 0.10)',
                padding: '36px 32px',
                boxSizing: 'border-box',
            }}>
                <h2 className="clases-titulo" style={{marginBottom: 32, fontWeight: 700, letterSpacing: 1, color: '#1976d2', textAlign: 'center', width: '100%'}}>Clases guardadas</h2>
                {clases.length === 0 ? (
                    <p className="clases-vacio">No hay clases guardadas.</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                        gap: '36px',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}>
                        {clases.map((clase, idx) => (
                        <div
                            key={idx}
                            className="clase-item"
                            style={{
                                background: '#fff',
                                borderRadius: 22,
                                boxShadow: '0 6px 24px rgba(25,118,210,0.10)',
                                marginBottom: 0,
                                padding: 32,
                                minWidth: 220,
                                maxWidth: 900,
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                wordBreak: 'break-word',
                                border: '1.5px solid #e3f2fd',
                                transition: 'box-shadow 0.2s, border 0.2s',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(25,118,210,0.18)'}
                            onMouseOut={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(25,118,210,0.10)'}
                        >
                            <div className="clase-info">
                                <div style={{display:'flex',alignItems:'center',marginBottom:8}}>
                                    <i className="bi bi-journal-bookmark" style={{color:'#1976d2',fontSize:'1.5rem',marginRight:8}}></i>
                                    <strong className="clase-titulo-item" style={{fontSize: '1.22rem', color: '#1976d2'}}>{clase.titulo}</strong>
                                    <span className="clase-fecha" style={{marginLeft: 12, color: '#888', fontWeight: 500}}>{formatFecha(clase.fecha)}</span>
                                </div>
                                <div className="clase-detalle" style={{marginTop: 4, marginBottom: 2}}>
                                    <b>Profesor:</b> <span style={{color:'#1976d2'}}>{clase.profesor_email || clase.profesor || 'No asignado'}</span>
                                </div>
                                <div className="clase-detalle" style={{marginBottom: 2}}>
                                    <b>Hora:</b> <span style={{color:'#1976d2'}}>{formatHora(clase.hora_entrada || clase.horaEntrada)} - {formatHora(clase.hora_salida || clase.horaSalida)}</span> | <b>Turno:</b> <span style={{color:'#1976d2'}}>{clase.turno}</span>
                                </div>
                                <div className="clase-detalle" style={{marginBottom: 2}}><b>Observaciones:</b> <span style={{color:'#333'}}>{clase.observaciones}</span></div>
                                <div className="clase-alumnos" style={{marginTop: 14}}>
                                    <span className="clase-alumnos-label" style={{fontWeight:600}}>Alumnos:</span>
                                    <ul className="clase-alumnos-lista" style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '10px 18px',
                                        fontSize: '1.01rem',
                                        marginTop: 2,
                                        marginBottom: 0,
                                        paddingLeft: 0,
                                        listStyle: 'none',
                                    }}>
                                        {clase.asistencia.map(a => (
                                            <li
                                                key={a.id}
                                                className={a.presente ? 'clase-alumno-presente' : 'clase-alumno-ausente'}
                                                style={{margin: 0, padding: 0, lineHeight: 1.4, whiteSpace: 'nowrap'}}
                                            >
                                                {a.nombre || a.id}: <span style={{color: a.presente ? '#388e3c' : '#d32f2f', fontWeight: 500}}>{a.presente ? 'Presente' : 'Ausente'}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {rol === 'profesor' || rol === 'suplente' ? (
                                <div className="clase-actions" style={{marginTop: 22, display: 'flex', gap: 16, justifyContent: 'flex-end'}}>
                                    <button className="btn btn-warning" onClick={() => onEdit(idx)} style={{borderRadius:10}}><i className="bi bi-pencil-square me-2"></i>Editar</button>
                                    <button className="btn btn-danger" onClick={() => onDelete(idx)} style={{borderRadius:10}}><i className="bi bi-trash me-2"></i>Eliminar</button>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            )}
            </div>
        </div> 
    );
}
