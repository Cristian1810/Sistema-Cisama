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
	## Instalación y uso local

	### Requisitos previos
	- Node.js >= 16
	- PostgreSQL (base de datos configurada y corriendo localmente)

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
	4. Inicia el servidor:
	   ```bash
	   node index.js
	   ```

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

	### Uso
	1. Accede a la app en [http://localhost:5173](http://localhost:5173) (o el puerto que indique Vite).
	2. Solo verás la pantalla de login. Ingresa con un usuario válido.
	3. Según el rol, tendrás acceso a las secciones correspondientes (admin, profesor, suplente).

	### Notas
	- El backend y frontend deben estar corriendo localmente.
	- No hay rutas ni configuraciones para despliegue en Vercel o Render.
	- Si tienes dudas, revisa el código fuente y los comentarios.

## Formato de tablas y conexión a la base de datos

### Estructura de tablas (PostgreSQL)

Asegúrate de crear estas tablas en tu base de datos local antes de iniciar el backend:

--DataBase name: Sistema_Cisama

```sql
-- Tabla de usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  ciudad VARCHAR(100),
  rol VARCHAR(20) NOT NULL, -- admin, profesor, suplente
  curso VARCHAR(100),
  activo BOOLEAN DEFAULT TRUE,
  foto TEXT
);

-- Tabla de cursos
CREATE TABLE cursos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE
);

-- Tabla de clases
CREATE TABLE clases (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  curso_id INTEGER REFERENCES cursos(id),
  fecha DATE,
  hora_inicio TIME,
  hora_fin TIME,
  activo BOOLEAN DEFAULT TRUE
);

-- Tabla de estudiantes
CREATE TABLE estudiantes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  grado VARCHAR(50),
  seccion VARCHAR(10),
  curso_id INTEGER REFERENCES cursos(id),
  turno VARCHAR(20),
  horaEntrada TIME,
  horaSalida TIME,
  telefono VARCHAR(20)
);
```

### Conexión a la base de datos

El backend se conecta a PostgreSQL usando las variables de entorno definidas en el archivo `.env` dentro de la carpeta `Backend`:

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=Sistema_Cisama
DB_PASSWORD=1234
DB_PORT=5432
```

Asegúrate de que estos valores coincidan con tu configuración local de PostgreSQL. Si cambias usuario, contraseña, nombre de base o puerto, actualízalos en el `.env` y reinicia el backend.

**Importante:**
- La base de datos debe estar creada antes de iniciar el backend.
- Puedes usar PgAdmin, DBeaver o psql para crear la base y ejecutar los scripts de tablas.
- El backend usará estas tablas para todas las operaciones CRUD.

