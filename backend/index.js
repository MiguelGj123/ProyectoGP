const app = require("./app");
const { PORT } = require("./utils/config");
const { connectDB } = require("./utils/db");

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  });
});
