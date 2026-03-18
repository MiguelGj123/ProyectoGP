const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Conexión exitosa a PostgreSQL local.");
    client.release();
  } catch (error) {
    console.error("❌ Error fatal al conectar a la BD:", error.message);
    process.exit(1); // Detiene la ejecución si no hay persistencia
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  connectDB,
};
