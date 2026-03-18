const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const {
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
} = require("./utils/middleware");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(tokenExtractor);

// Rutas
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "OK", message: "API REST GameStore funcionando" });
});

app.use("/api", usersRouter);
app.use("/api", loginRouter);

// Middlewares de fin de ciclo
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
