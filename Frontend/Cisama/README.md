
---

# Sistema Cisama

## Descripción
Sistema Cisama es una plataforma web para la gestión de cursos, clases y usuarios (profesores, suplentes y administradores) de la institucion educativa.

Incluye un backend en Node.js/Express y un frontend en React + Vite.

---

## Instalación

### Requisitos previos
- Node.js >= 16
- PostgreSQL (base de datos configurada)


### Backend
1. Ve a la carpeta `Backend`:
	```bash
	cd Backend
	```
2. Instala dependencias:
	```bash
	npm install
	```
3. Copia el archivo `.env.example` a `.env` y ajusta los valores según tu configuración de PostgreSQL:
	```bash
	cp .env.example .env
	```
4. Instala dotenv (si no está instalado):
	```bash
	npm install dotenv
	```
5. Inicia el servidor:
	```bash
	node index.js
	```

> El backend usa variables de entorno para la conexión a la base de datos. Puedes modificar el archivo `.env` para cambiar usuario, contraseña, nombre de base, host y puerto.

### Frontend
1. Ve a la carpeta `Frontend/Cisama`:
	```bash
	cd Frontend/Cisama
	```
2. Instala dependencias:
	```bash
	npm install
	```
3. Inicia la app:
	```bash
	npm run dev
	```

---

## Uso

1. Accede a la app en [http://localhost:5173](http://localhost:5173) (o el puerto que indique Vite).
2. Inicia sesión con un usuario válido.
3. Navega por las secciones según tu rol.

---

## Roles de usuario
- **Administrador**: Gestiona usuarios, cursos y clases. Acceso total.
- **Profesor**: Gestiona sus clases y estudiantes asignados.
- **Suplente**: Puede gestionar clases y estudiantes cuando reemplaza a un profesor.


---

## Flujo principal de la app
1. Login de usuario.
2. Según el rol, acceso a diferentes menús y funcionalidades.
3. CRUD de cursos, clases y usuarios según permisos.
4. Visualización y gestión de asistencia, horarios y perfiles.

---

## Notas
- Asegúrate de tener el backend corriendo antes de usar el frontend.
- Si tienes dudas, revisa el código fuente y los comentarios.
