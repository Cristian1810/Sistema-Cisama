
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

