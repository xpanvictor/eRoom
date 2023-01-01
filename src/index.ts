require("dotenv").config();
const http = require("http");
const server_configs = require("./constants/config");

function main() {
  const server = http.createServer();
  // listener
  const { PORT } = server_configs;
  server.listen(PORT, () => {
    console.log(`💯server listening at localhost:${PORT}`);
  });
}

main();
