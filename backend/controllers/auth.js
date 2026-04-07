const authRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { query } = require("../utils/db");
const { SECRET } = require("../utils/config");

// Esquemas de validación
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// POST /api/auth/register
authRouter.post("/register", async (req, res, next) => {
  try {
    const { email, password } = await registerSchema.validateAsync(req.body);

    const roleResult = await query(
      "SELECT id FROM roles WHERE nombre = 'ESTANDAR'",
    );
    const rolId = roleResult.rows[0].id;

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await query(
      "INSERT INTO usuarios (email, password_hash, rol_id) VALUES ($1, $2, $3) RETURNING id, email",
      [email, passwordHash, rolId],
    );

    res
      .status(201)
      .json({ message: "Usuario registrado", user: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = await loginSchema.validateAsync(req.body);

    const userQuery = `
      SELECT u.id, u.email, u.password_hash, r.nombre as rol
      FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE u.email = $1
    `;
    const result = await query(userQuery, [email]);
    const user = result.rows[0];

    const passwordCorrect =
      user && (await bcrypt.compare(password, user.password_hash));

    if (!passwordCorrect) {
      const authError = new Error("Email o contraseña inválidos");
      authError.name = "AuthenticationError";
      throw authError;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      SECRET,
      { expiresIn: "24h" },
    );

    res.status(200).json({ token, email: user.email, rol: user.rol });
  } catch (error) {
    next(error);
  }
});

module.exports = authRouter;
