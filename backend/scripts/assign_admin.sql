-- Script para promover un usuario a Administrador
-- Uso: Reemplazar 'correo_del_usuario' por el email real del usuario registrado.

UPDATE usuarios 
SET rol_id = (SELECT id FROM roles WHERE nombre = 'ADMIN') 
WHERE email = 'test@gamestore.com';