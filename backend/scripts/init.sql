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

-- Datos semilla (Mock Data) para poblar el Catálogo y probar paginación/búsqueda
INSERT INTO videojuegos (titulo, descripcion, genero, precio) VALUES 
('The Legend of Zelda: Tears of the Kingdom', 'Épica aventura en mundo abierto explorando Hyrule.', 'Aventura', 69.99),
('Hollow Knight', 'Metroidvania desafiante con estilo artístico único y un mundo subterráneo.', 'Plataformas', 14.99),
('Cyberpunk 2077', 'RPG de acción en una megalópolis distópica con múltiples finales.', 'RPG', 59.99),
('Elden Ring', 'Juego de rol de acción y fantasía oscura creado por Hidetaka Miyazaki y George R. R. Martin.', 'RPG', 59.99),
('Stardew Valley', 'Relajante simulador de granja con mecánicas de combate y relaciones sociales.', 'Simulación', 14.99),
('Persona 5 Royal', 'Juego de rol japonés con combates por turnos y simulación social estudiantil.', 'JRPG', 59.99),
('DOOM Eternal', 'Frenético shooter en primera persona contra hordas de demonios.', 'Shooter', 39.99),
('Hades', 'Roguelike de acción rápida basado en la mitología griega.', 'Roguelike', 24.99),
('Super Mario Odyssey', 'Aventura de plataformas 3D recolectando lunas por todo el mundo.', 'Plataformas', 59.99),
('Red Dead Redemption 2', 'Historia profunda de forajidos en el salvaje oeste americano.', 'Acción', 59.99),
('The Witcher 3: Wild Hunt', 'Acompaña a Geralt de Rivia en un inmenso mundo abierto lleno de monstruos.', 'RPG', 29.99),
('Celeste', 'Juego de plataformas desafiante que trata sobre la superación personal.', 'Plataformas', 19.99),
('God of War', 'Kratos y Atreus viajan por la mitología nórdica en una aventura inolvidable.', 'Acción', 49.99),
('EA Sports FC 24', 'El simulador de fútbol más realista con las mejores ligas del mundo.', 'Deportes', 69.99),
('Age of Empires II: Definitive Edition', 'Clásico juego de estrategia en tiempo real remasterizado en 4K.', 'Estrategia', 19.99),
('Minecraft', 'Juego de supervivencia y construcción con bloques de mundo infinito.', 'Supervivencia', 29.99),
('Grand Theft Auto V', 'Explora Los Santos en este juego de acción en mundo abierto.', 'Acción', 29.99),
('Bloodborne', 'Un oscuro y aterrador juego de acción RPG en la ciudad maldita de Yharnam.', 'RPG', 19.99),
('Horizon Zero Dawn', 'Caza máquinas con forma de dinosaurios en un mundo post-apocalíptico.', 'Aventura', 39.99),
('Animal Crossing: New Horizons', 'Crea tu propia isla paradisíaca y convive con animales antropomórficos.', 'Simulación', 59.99);