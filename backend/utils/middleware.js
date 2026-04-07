const jwt = require("jsonwebtoken");
const { query } = require("./db");
const { SECRET } = require("./config");

// Manejador centralizado de errores
const ERROR_HANDLERS = {
  // Errores de validación (ej. Joi o manuales)
  ValidationError: (res, error) => {
    return res.status(400).json({ error: [error.message] });
  },

  // Errores de autenticación y JWT
  AuthenticationError: (res, error) => {
    return res.status(401).json({ error: [error.message] });
  },
  JsonWebTokenError: (res) => {
    return res.status(401).json({ error: ["token invalid"] });
  },
  TokenExpiredError: (res) => {
    return res.status(401).json({ error: ["token expired"] });
  },

  // Manejo de errores nativos de PostgreSQL
  DatabaseError: (res, error) => {
    // 23505 es el código de Postgres para violación de restricción UNIQUE
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ error: ["El registro ya existe (duplicado)."] });
    }
    console.error("Database Error:", error);
    return res
      .status(500)
      .json({ error: ["Error interno de la base de datos."] });
  },

  defaultError: (res, error) => {
    console.error("Unknown Error:", error);
    return res.status(500).json({ error: ["Internal Server Error"] });
  },
};

const errorHandler = (error, req, res, /*eslint-disable-line */ next) => {
  // Si el error viene de 'pg', su nombre suele ser 'error'. Lo forzamos a DatabaseError para nuestro handler.
  const errorName = error.code && error.severity ? "DatabaseError" : error.name;

  const handler = ERROR_HANDLERS[errorName] || ERROR_HANDLERS.defaultError;
  return handler(res, error);
};

const unknownEndpoint = (req, res) => {
  return res.status(404).json({ error: "unknown endpoint" });
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");

  // 1. Verificar presencia del header
  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    const error = new Error("token missing");
    error.name = "AuthenticationError";
    return next(error); // Usamos return next(error) para asegurar que se detenga aquí
  }

  const token = authorization.split(" ")[1];

  try {
    // 2. Verificar validez del token
    const decodedToken = jwt.verify(token, SECRET);
    if (!decodedToken.id) {
      const error = new Error("token invalid: missing user id");
      error.name = "AuthenticationError";
      throw error;
    }

    // 3. Adaptación a SQL: Buscar usuario en Postgres
    const userQuery = "SELECT id, email, rol_id FROM usuarios WHERE id = $1";
    const result = await query(userQuery, [decodedToken.id]);
    const user = result.rows[0];

    if (!user) {
      const error = new Error("token invalid: user not found");
      error.name = "AuthenticationError";
      throw error;
    }

    // 4. Inyectar datos en la petición para los controladores
    // He añadido el rol porque lo necesitas para las rutas de ADMIN
    req.user = {
      id: user.id,
      rol: decodedToken.rol, // Usamos el rol del token para evitar un JOIN extra si no es necesario
    };

    next();
  } catch (err) {
    next(err); // Captura errores de JWT (JsonWebTokenError) o los lanzados manualmente
  }
};

module.exports = {
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
};
