# 🎮 GameStore - Proyecto Grupal (Gestión de Proyectos)

Este repositorio contiene la implementación completa de **GameStore**, una aplicación web de gestión de catálogo de videojuegos (CRUD) desarrollada como proyecto académico para la asignatura de Gestión de Proyectos.

El objetivo principal de esta plataforma es cumplir con los requerimientos técnicos de una **Single Page Application (SPA)** consumiendo una **API REST** propia, garantizando la persistencia de datos y un control de accesos basado en roles (Administrador y Estándar).

---

## 🏛 Arquitectura del Sistema

El proyecto sigue una arquitectura clásica de tres capas (Three-Tier Architecture), alojada en un entorno **Monorepo** gestionado mediante los _workspaces_ de npm:

1. **Capa de Presentación (Frontend):** Construida como una SPA estricta. Toda la navegación y el renderizado se realizan en el cliente. Se comunica con el backend exclusivamente a través de peticiones HTTP asíncronas.
2. **Capa de Lógica de Negocio (Backend):** Servidor web sin estado (Stateless) que expone una API RESTful. Se encarga de la validación de entrada, la autenticación, la autorización mediante tokens y la orquestación de las consultas a la base de datos.
3. **Capa de Datos (Base de Datos):** Motor relacional desplegado de forma contenerizada para garantizar la consistencia, integridad referencial y aislamiento del entorno local.

---

## 🛠 Stack Tecnológico Detallado

### Frontend (SPA)

- **React (v19):** Librería principal para la construcción de interfaces de usuario declarativas y basadas en componentes.
- **Vite:** Herramienta de _bundling_ de nueva generación que sustituye a Webpack. Ofrece un servidor de desarrollo ultrarrápido con Hot Module Replacement (HMR) nativo y optimización de compilación.
- **Redux Toolkit (RTK):** Gestor de estado global estándar de la industria. Se ha utilizado para evitar el _prop-drilling_ y centralizar:
  - La sesión del usuario (`authSlice`).
  - El inventario general y sus filtros (`videogamesSlice`).
  - La colección privada del usuario (`userListSlice`).
- **React Router DOM (v7):** Enrutamiento dinámico en el lado del cliente para permitir la navegación sin recarga de página.
- **Axios:** Cliente HTTP basado en promesas, utilizado por su capacidad de interceptar peticiones y configurar _headers_ dinámicos (inyectando automáticamente el Bearer Token JWT en los servicios).

### Backend (API REST)

- **Node.js & Express (v5):** Entorno de ejecución y _framework_ minimalista para construir la API REST. Proporciona el sistema de enrutamiento (`Router`) y la cadena de _middlewares_.
- **PostgreSQL (pg):** Driver nativo para la conexión directa a la base de datos, realizando consultas SQL puras (sin ORM) para maximizar el rendimiento y el control sobre las transacciones.
- **JSON Web Tokens (jsonwebtoken):** Estándar abierto (RFC 7519) para transmitir información de identidad de forma segura. Permite autenticación sin estado (_stateless_).
- **Bcrypt:** Librería de encriptación de contraseñas mediante funciones de _hash_ de una sola vía (con salt de 10 rondas), garantizando que nunca se guarden contraseñas en texto plano.
- **Joi:** Motor de validación de esquemas de datos utilizado para sanitizar el `req.body` antes de cualquier inserción en la base de datos, evitando inyecciones y datos corruptos.

### Infraestructura y Herramientas

- **Docker Compose:** Utilizado exclusivamente para aprovisionar el entorno de la base de datos de forma reproducible, aislando dependencias y versionando la infraestructura.
- **Jest & Supertest:** Framework de pruebas para realizar _Integration Testing_ directamente sobre los endpoints de la API, validando la seguridad por roles sin necesidad de levantar el servidor manualmente.
- **ESLint (Flat Config) & Prettier:** Herramientas de _linting_ y formateo integradas para mantener un estándar de código unificado en todo el monorepo.

---

## 🚀 Guía de Despliegue Local

Para levantar el proyecto en tu máquina y poder evaluarlo, sigue cuidadosamente estos pasos.

### Requisitos Previos

1. **Node.js** (v18 o superior) instalado.
2. **Docker Desktop** (o Docker Engine + Docker Compose) funcionando.
3. El puerto **3000** (Backend), **5173** (Frontend) y **5432** (Postgres) libres en tu máquina.

### Paso 1: Configurar la Base de Datos (Docker)

El proyecto incluye un contenedor de PostgreSQL preconfigurado con un script de inicialización (`init.sql`) que creará automáticamente las tablas, los roles y 20 videojuegos de prueba.

1. Abre una terminal en la raíz del proyecto.
2. Levanta el contenedor en segundo plano:

```bash
  docker compose -f backend/docker-compose.dev.yml up -d
```

### Paso 2: Variables de Entorno del Backend

1. Navega a la carpeta del backend:

```bash
  cd backend
```

2. Renombra o copia el archivo .env.template a .env:

```bash
  cp .env.template .env
```

3. Abre el archivo .env recién creado y asegúrate de rellenarlo con las credenciales de Docker:
<pre>
PORT=3000
DB_USER=admin
DB_PASSWORD=adminpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gamestore_db
SECRET=tu_secreto_para_jwt_aqui
</pre>

### Paso 3: Instalación de Dependencias

Vuelve a la raíz del proyecto (el monorepo) e instala las dependencias de todas las áreas de trabajo de golpe:

```bash
  cd ..
  npm install
```

### Paso 4: Ejecución Concurrente

Gracias a la configuración de los workspaces de npm en el monorepo, puedes arrancar el Backend y el Frontend al mismo tiempo con un solo comando desde la raíz del proyecto:

```bash
  npm run dev
```

- El Backend arrancará en: http://localhost:3000

- El Frontend arrancará en: http://localhost:5173

(Nota: El frontend está configurado mediante Vite Proxy para redirigir todas las peticiones que empiecen por /api al puerto 3000, evadiendo así problemas de CORS).

---

## 🧪 Uso y Demo de la Aplicación

Abre tu navegador en http://localhost:5173. Para poder probar la matriz de roles y permisos (US-04 a US-13), el sistema requiere que te registres.

### Modo Usuario Estándar (Lectura y Listas Personales)

1. Ve a "Registro" y crea una cuenta (ej. user@gamestore.com).

2. Haz Login. El sistema te asignará automáticamente el rol ESTANDAR.

3. Navega por el Catálogo, utiliza la Paginación y la Búsqueda.

4. Haz clic en "⭐ Guardar en mi lista" en cualquier tarjeta.

5. Accede a "Mi Lista" en el menú superior para ver tu colección privada y poder eliminar elementos de ella.

### Modo Administrador (Altas, Bajas y Modificaciones)

Según los requisitos del alcance, el rol de Administrador debe asignarse manualmente en la base de datos.

2. Regístrate con una cuenta nueva (ej. admin@gamestore.com).

3. Sin detener la aplicación, abre una nueva terminal y ejecuta este comando de Docker para inyectar el cambio de rol:

```bash
  docker exec -it gamestore_postgres psql -U admin -d gamestore_db -c "UPDATE usuarios SET rol_id = (SELECT id FROM roles WHERE nombre = 'ADMIN') WHERE email = 'admin@gamestore.com';"
```

3. Inicia sesión con esta cuenta. Verás que en la cabecera aparece tu rol ADMIN.

4. En el catálogo, se habilitará automáticamente un formulario superior para crear videojuegos, y las tarjetas mostrarán los botones naranjas y rojos para Editar y Borrar elementos del inventario público.

---

## 🔬 Ejecución de Pruebas Automatizadas

El proyecto incluye pruebas de integración construidas con Jest y Supertest (desarrolladas con asistencia de IA) que validan, sin levantar el servidor, el rechazo de peticiones no autorizadas y los errores de validación de datos.

Para ejecutarlas, ve a la carpeta del backend y lanza el script de testing:

```bash
  cd backend
  npm run test
```

---

## 👥 Equipo de Desarrollo

Este proyecto ha sido posible gracias al esfuerzo y colaboración de:

- **Liviu Deleanu**
- **André Almaraz Reyes**
- **Keneth Campos Salazar**
- **Miguel García Jiménez**
- **Ibai Munné Ugalde**
- **Adrián Ramírez Gómez**

---

> [!TIP]
> _Proyecto de código abierto desarrollado para la asignatura de Gestión de Proyectos - 2025/26_
