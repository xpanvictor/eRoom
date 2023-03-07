const serverConfig = {
  // environment working on: dev | prod
  ENV: process.env.ENV || "dev",
  // port to run server on
  PORT: process.env.PORT || 4015,
  // mongodb database conn string
  MONGO_CONN_URL:
    process.env.MONGO_CONN_URL || "mongodb://127.0.0.1:27017/eclass",
};

export default serverConfig;
