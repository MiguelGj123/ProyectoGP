const jwt = require("jsonwebtoken");
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

const errorHandler = (error, req, res, next) => {
  // Si el error viene de 'pg', su nombre suele ser 'error'. Lo forzamos a DatabaseError para nuestro handler.
  const errorName = error.code && error.severity ? "DatabaseError" : error.name;

  const handler = ERROR_HANDLERS[errorName] || ERROR_HANDLERS.defaultError;
  return handler(res, error);
};

const unknownEndpoint = (req, res) => {
  return res.status(404).json({ error: "unknown endpoint" });
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }
  next();
};

module.exports = {
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
};
