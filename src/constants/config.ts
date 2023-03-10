import path from "path";
import dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, "../", "../", ".env"),
});

const serverConfig = {
  // environment working on: dev | prod
  ENV: process.env.ENV || "dev",
  SECRET: process.env.SECRET,
  // port to run server on
  PORT: process.env.PORT || 4015,
  // mongodb database conn string
  MONGO_CONN_URL:
    process.env.MONGO_CONN_URL || "mongodb://127.0.0.1:27017/eclass",
  // gmail service
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
};

export default serverConfig;
