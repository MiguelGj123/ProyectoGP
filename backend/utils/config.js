require("dotenv").config();

const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET || "gamestore_secret_key_temporal";

module.exports = {
  PORT,
  SECRET,
};
