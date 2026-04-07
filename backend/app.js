const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectDB } = require("./utils/db");

const { errorHandler, unknownEndpoint } = require("./utils/middleware");

const authRouter = require("./controllers/auth");
const usersRouter = require("./controllers/users");

const videogamesRouter = require("./controllers/videogames");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

connectDB();

// Rutas
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "OK", message: "API REST GameStore funcionando" });
});

app.use("/api", authRouter);
app.use("/api", videogamesRouter);
app.use("/api/users", usersRouter);

// Middlewares de fin de ciclo
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
