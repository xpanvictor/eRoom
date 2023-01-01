import dotenv = require("dotenv");
import http = require("http");
import serverConfig from "./constants/config";

dotenv.config();

function main() {
  const server = http.createServer();
  // listener
  const { PORT } = serverConfig;
  server.listen(PORT, () => {
    console.log(`💯server listening at localhost:${PORT}`);
  });
}

main();
