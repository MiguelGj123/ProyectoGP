const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { query } = require("../utils/db");

// Esquema de validación estricto para evitar basura en la BD
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// US-03: POST /api/register
usersRouter.post("/register", async (req, res, next) => {
  try {
    // 1. Validar el body de la petición
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      const joiError = new Error(error.details[0].message);
      joiError.name = "ValidationError";
      throw joiError; // Lo mandamos a nuestro errorHandler
    }

    const { email, password } = value;

    // 2. Obtener el ID del rol predeterminado ('ESTANDAR')
    // Asignación automática exigida por el alcance
    const roleResult = await query(
      "SELECT id FROM roles WHERE nombre = 'ESTANDAR'",
    );
    if (roleResult.rows.length === 0) {
      return res.status(500).json({
        error: ["Error crítico: Rol ESTANDAR no encontrado en la BD."],
      });
    }
    const rolId = roleResult.rows[0].id;

    // 3. Encriptar la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Guardar en la base de datos
    const insertQuery = `
      INSERT INTO usuarios (email, password_hash, rol_id)
      VALUES ($1, $2, $3)
      RETURNING id, email, created_at
    `;
    const result = await query(insertQuery, [email, passwordHash, rolId]);

    // 5. Responder con HTTP 201 (Created) y los datos seguros (NUNCA devolver el hash)
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: result.rows[0],
    });
  } catch (error) {
    // Si el email ya existe, el errorHandler capturará el código 23505 de Postgres
    next(error);
  }
});

module.exports = usersRouter;
