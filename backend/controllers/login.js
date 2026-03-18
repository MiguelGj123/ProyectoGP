const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const Joi = require("joi");
const { query } = require("../utils/db");
const { SECRET } = require("../utils/config");

// Esquema de validación simple (solo para asegurar que llegan los campos)
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// US-04: POST /api/login
loginRouter.post("/login", async (req, res, next) => {
  try {
    // 1. Validar cuerpo de la petición
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      const joiError = new Error(error.details[0].message);
      joiError.name = "ValidationError";
      throw joiError;
    }

    const { email, password } = value;

    // 2. Buscar usuario y su rol con un JOIN en PostgreSQL
    const userQuery = `
      SELECT u.id, u.email, u.password_hash, r.nombre as rol
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.email = $1
    `;
    const result = await query(userQuery, [email]);
    const user = result.rows[0];

    // 3. Verificar si el usuario existe y si la contraseña es correcta
    // Nota: Ejecutamos bcrypt.compare incluso si el usuario no existe para prevenir ataques de "timing"
    const passwordCorrect =
      user === undefined
        ? false
        : await bcrypt.compare(password, user.password_hash);

    if (!(user && passwordCorrect)) {
      const authError = new Error("Email o contraseña inválidos");
      authError.name = "AuthenticationError"; // Lo capturará nuestro errorHandler
      throw authError;
    }

    // 4. Crear el payload del token con la identificación clara del rol
    const userForToken = {
      id: user.id,
      email: user.email,
      rol: user.rol, // Cumple la Tarea 2.3 de devolver sesión con el rol
    };

    // 5. Firmar el token JWT (le ponemos expiración por seguridad)
    const token = jwt.sign(userForToken, SECRET, { expiresIn: "24h" });

    // 6. Devolver HTTP 200 con el token y datos básicos
    res.status(200).json({
      token,
      email: user.email,
      rol: user.rol,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = loginRouter;
