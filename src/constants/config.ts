const serverConfig = {
  // environment working on: dev | prod
  ENV: process.env.ENV || "dev",
  // port to run server on
  PORT: process.env.PORT || 4015,
};

export default serverConfig;
