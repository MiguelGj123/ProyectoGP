const videogamesRouter = require("express").Router();
const { query } = require("../utils/db");
const { tokenExtractor } = require("../utils/middleware");

// Middleware local para proteger rutas (Solo ADMIN)
const requireAdmin = (req, res, next) => {
  if (req.user.rol !== "ADMIN") {
    return res

      .status(403)
      .json({ error: ["Acceso denegado. Se requiere rol ADMIN."] });
  }
  next();
};

// GET /api/videogames (Público - US-14 y US-15: Búsqueda y Paginación)
videogamesRouter.get("/videogames", async (req, res, next) => {
  try {
    const { search, genero, page = 1, limit = 4 } = req.query; // limit = 4 para que sea visible con pocos datos

    let dbQuery = "SELECT * FROM videojuegos";
    let countQuery = "SELECT COUNT(*) FROM videojuegos";
    const queryParams = [];
    let conditions = [];

    if (search) {
      queryParams.push(`%${search}%`);
      conditions.push(`titulo ILIKE $${queryParams.length}`);
    }

    if (genero) {
      queryParams.push(`%${genero}%`);
      conditions.push(`genero ILIKE $${queryParams.length}`);
    }

    if (conditions.length > 0) {
      const whereClause = " WHERE " + conditions.join(" AND ");
      dbQuery += whereClause;
      countQuery += whereClause;
    }

    dbQuery += " ORDER BY created_at DESC";

    // 1. Ejecutar COUNT antes de añadir LIMIT/OFFSET a los parámetros
    const countResult = await query(countQuery, queryParams);
    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    // 2. Aplicar Paginación
    const offset = (page - 1) * limit;
    queryParams.push(limit);
    dbQuery += ` LIMIT $${queryParams.length}`;

    queryParams.push(offset);
    dbQuery += ` OFFSET $${queryParams.length}`;

    // 3. Ejecutar consulta principal
    const result = await query(dbQuery, queryParams);

    res.status(200).json({
      items: result.rows,
      totalPages,
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    next(error);
  }
});

// US-10: POST /api/videogames (Crear - Solo Admin)
videogamesRouter.post(
  "/videogames",
  tokenExtractor,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { titulo, descripcion, genero, precio } = req.body;
      const insertQuery = `
      INSERT INTO videojuegos (titulo, descripcion, genero, precio)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
      const result = await query(insertQuery, [
        titulo,
        descripcion,
        genero,
        precio,
      ]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },
);

// US-11: PUT /api/videogames/:id (Editar - Solo Admin)
videogamesRouter.put(
  "/videogames/:id",
  tokenExtractor, // Primero extraemos quién es el usuario
  requireAdmin,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { titulo, descripcion, genero, precio } = req.body;
      const updateQuery = `
      UPDATE videojuegos 
      SET titulo = $1, descripcion = $2, genero = $3, precio = $4
      WHERE id = $5 RETURNING *
    `;
      const result = await query(updateQuery, [
        titulo,
        descripcion,
        genero,
        precio,
        id,
      ]);
      if (result.rows.length === 0)
        return res.status(404).json({ error: ["Videojuego no encontrado"] });
      res.status(200).json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },
);

// US-11: DELETE /api/videogames/:id (Borrar - Solo Admin)
videogamesRouter.delete(
  "/videogames/:id",
  tokenExtractor,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await query(
        "DELETE FROM videojuegos WHERE id = $1 RETURNING id",
        [id],
      );
      if (result.rows.length === 0)
        return res.status(404).json({ error: ["Videojuego no encontrado"] });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
);

module.exports = videogamesRouter;
