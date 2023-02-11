import dotenv = require("dotenv");
import http = require("http");
import serverConfig from "./constants/config";
import app = require("./App");
import Exception = require("./error/RejectionException/unhandled");

dotenv.config();

function main() {
  const server = http.createServer(app);
  // handle runtime ignored errors
  Exception.unhandledRejection(server);
  Exception.unhandledException();
  // listener
  const { PORT } = serverConfig;
  server.listen(PORT, () => {
    console.log(`💯server listening at localhost:${PORT}`);
  });
}

main();
