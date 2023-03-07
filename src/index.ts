import dotenv = require("dotenv");
import http = require("http");
import { Server } from "socket.io";
import serverConfig from "./constants/config";
import app = require("./App");
import Exception = require("./error/RejectionException/unhandled");
import connectMongo from "./config/db/connect";

dotenv.config();

async function main() {
  // HTTP server docked
  const httpServer = http.createServer(app);
  // Socket.io server docked
  const io = new Server(httpServer, {});
  io.on("connection", (socket) => {
    console.log("Socket connection initialized");
    socket.on("message", (msg) => console.log(msg));
  });
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
