import dotenv = require("dotenv");
import http = require("http");
import serverConfig from "./constants/config";
import app = require("./App");
import Exception = require("./error/RejectionException/unhandled");
import connectMongo from "./config/db/connect";

dotenv.config();

async function main() {
  // todo: work on the socket attachment here
  const server = http.createServer(app);
  // handle runtime ignored errors
  Exception.unhandledRejection(server);
  Exception.unhandledException();
  // connect the database here
  await connectMongo();
  // listener
  const { ENV, PORT } = serverConfig;
  server.listen(PORT, () => {
    console.log(`${ENV.toUpperCase()} 💯server listening at localhost:${PORT}`);
  });
}

main();
