import dotenv = require("dotenv");
import http = require("http");
import path from "path";
import serverConfig from "./constants/config";
import app = require("./App");
import Exception = require("./error/RejectionException/unhandled");
import connectMongo from "./config/db/connect";
import SocketClass from "./config/socket/init";
import createChatChannel from "./lib/chatChannel";

dotenv.config({
  path: path.join(__dirname, "../", ".env"),
});

async function main() {
  // check availability of env

  // HTTP server docked
  const httpServer = http.createServer(app);
  // Socket.io server docked
  const ioServer = new SocketClass(httpServer);
  console.log(ioServer.name, "socket has been connected");
  // pass socket class to chat channel originator
  createChatChannel(ioServer);
  // handle runtime ignored errors
  Exception.unhandledRejection(httpServer);
  Exception.unhandledException();
  // connect the database here
  await connectMongo();
  // listener
  const { ENV, PORT } = serverConfig;
  httpServer.listen(PORT, () => {
    console.log(`${ENV.toUpperCase()} 💯server listening at localhost:${PORT}`);
  });
}

main();
