const usersRouter = require("express").Router();
const { query } = require("../utils/db");
const { tokenExtractor } = require("../utils/middleware");

// Todas las rutas de este router requieren estar logueado
usersRouter.use(tokenExtractor);

// GET /api/users/list (Obtener lista personal)
usersRouter.get("/list", async (req, res, next) => {
  try {
    const result = await query(
      `SELECT v.* FROM videojuegos v 
       JOIN lista_personal lp ON v.id = lp.videojuego_id 
       WHERE lp.usuario_id = $1`,
      [req.user.id], // Extraído automáticamente por el middleware
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/users/list (Añadir a lista)
usersRouter.post("/list", async (req, res, next) => {
  try {
    const { videojuegoId } = req.body;
    await query(
      "INSERT INTO lista_personal (usuario_id, videojuego_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [req.user.id, videojuegoId],
    );
    res.status(201).json({ message: "Agregado a tu lista" });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/list/:id
usersRouter.delete("/list/:id", async (req, res, next) => {
  try {
    await query(
      "DELETE FROM lista_personal WHERE usuario_id = $1 AND videojuego_id = $2",
      [req.user.id, req.params.id],
    );
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
