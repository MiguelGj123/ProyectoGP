const supertest = require("supertest");
const app = require("../app");
const { query } = require("../utils/db");
const api = supertest(app);

describe("US-16 / Tarea 3.3: Validación de Privilegios ADMIN", () => {
  let adminToken = "";
  let estandarToken = "";
  let juegoTestId = null;

  const adminEmail = "admin_test@gamestore.com";
  const estandarEmail = "user_test@gamestore.com";

  beforeAll(async () => {
    // 1. Crear usuario ESTANDAR y obtener su token
    await api
      .post("/api/register")
      .send({ email: estandarEmail, password: "password123" });
    const resStd = await api
      .post("/api/login")
      .send({ email: estandarEmail, password: "password123" });
    estandarToken = resStd.body.token;

    // 2. Crear usuario ADMIN (Promoción manual necesaria según alcance) [cite: 262]
    await api
      .post("/api/register")
      .send({ email: adminEmail, password: "password123" });
    await query(
      "UPDATE usuarios SET rol_id = (SELECT id FROM roles WHERE nombre = 'ADMIN') WHERE email = $1",
      [adminEmail],
    );
    const resAdm = await api
      .post("/api/login")
      .send({ email: adminEmail, password: "password123" });
    adminToken = resAdm.body.token;
  });

  afterAll(async () => {
    // Limpieza de datos de prueba
    await query("DELETE FROM usuarios WHERE email IN ($1, $2)", [
      adminEmail,
      estandarEmail,
    ]);
    if (juegoTestId) {
      await query("DELETE FROM videojuegos WHERE id = $1", [juegoTestId]);
    }
  });

  const nuevoJuego = {
    titulo: "Test Game",
    descripcion: "Test",
    genero: "Test",
    precio: 10.0,
  };

  // --- PRUEBAS DE CREACIÓN (POST) ---
  describe("POST /api/videogames", () => {
    test("Deniega la creación (403) si el usuario es ESTANDAR", async () => {
      await api
        .post("/api/videogames")
        .set("Authorization", `Bearer ${estandarToken}`)
        .send(nuevoJuego)
        .expect(403);
    });

    test("Permite la creación (201) si el usuario es ADMIN", async () => {
      const response = await api
        .post("/api/videogames")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(nuevoJuego)
        .expect(201);

      juegoTestId = response.body.id; // Guardamos para las siguientes pruebas
    });
  });

  // --- PRUEBAS DE EDICIÓN (PUT) ---
  describe("PUT /api/videogames/:id", () => {
    test("Deniega la edición (403) a un usuario ESTANDAR", async () => {
      await api
        .put(`/api/videogames/${juegoTestId}`)
        .set("Authorization", `Bearer ${estandarToken}`)
        .send({ ...nuevoJuego, titulo: "Editado por User" })
        .expect(403);
    });

    test("Permite la edición (200) a un usuario ADMIN", async () => {
      await api
        .put(`/api/videogames/${juegoTestId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ ...nuevoJuego, titulo: "Editado por Admin" })
        .expect(200);
    });
  });

  // --- PRUEBAS DE ELIMINACIÓN (DELETE) ---
  describe("DELETE /api/videogames/:id", () => {
    test("Deniega el borrado (403) a un usuario ESTANDAR", async () => {
      await api
        .delete(`/api/videogames/${juegoTestId}`)
        .set("Authorization", `Bearer ${estandarToken}`)
        .expect(403);
    });

    test("Permite el borrado (204) a un usuario ADMIN", async () => {
      await api
        .delete(`/api/videogames/${juegoTestId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(204);

      juegoTestId = null; // Ya está borrado
    });
  });
});
