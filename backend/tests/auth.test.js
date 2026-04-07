const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

describe("Controlador de Autenticación - /api/login", () => {
  test("Falla con error 400 si el email no tiene un formato válido", async () => {
    const credencialesInvalidas = {
      email: "usuariocorreo.com", // Sin la @
      password: "password123",
    };

    const response = await api
      .post("/api/login")
      .send(credencialesInvalidas)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error[0]).toMatch(/email/i);
  });

  test("Falla con error 401 si las credenciales no existen en la BD", async () => {
    const credencialesFalsas = {
      email: "noexisto@gamestore.com",
      password: "wrongpassword",
    };

    const response = await api
      .post("/api/login")
      .send(credencialesFalsas)
      .expect(401);

    expect(response.body.error[0]).toBe("Email o contraseña inválidos");
  });
});
