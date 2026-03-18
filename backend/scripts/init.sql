-- Creación de tabla de Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Creación de tabla de Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creación de tabla de Videojuegos (Inventario)
CREATE TABLE videojuegos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    genero VARCHAR(100),
    precio DECIMAL(10, 2), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creación de tabla pivot para el Listado Personal del Usuario
CREATE TABLE lista_personal (
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    videojuego_id INT REFERENCES videojuegos(id) ON DELETE CASCADE,
    agregado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, videojuego_id)
);

-- Inserción de los roles base exigidos en el alcance
INSERT INTO roles (nombre) VALUES ('ESTANDAR'), ('ADMIN');

-- (Opcional) Datos semilla para tener algo que renderizar en el Frontend
INSERT INTO videojuegos (titulo, descripcion, genero, precio) VALUES 
('The Legend of Zelda: Tears of the Kingdom', 'Aventura en mundo abierto', 'Aventura', 69.99),
('Hollow Knight', 'Metroidvania desafiante con estilo artístico único', 'Plataformas', 14.99),
('Cyberpunk 2077', 'RPG de acción en una megalópolis distópica', 'RPG', 59.99);