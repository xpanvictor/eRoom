import dotenv = require("dotenv");
import http = require("http");
import path from "path";
import serverConfig from "./constants/config";
import app = require("./App");
import Exception = require("./error/RejectionException/unhandled");
import connectMongo from "./config/db/connect";
import SocketClass from "./config/socket/init";
import genConsts from "./constants/gen-consts";
import chatSocketHandler from "./lib/chatChannel";
import logger from "./utils/logger";

dotenv.config({
  path: path.join(__dirname, "../", ".env"),
});

async function main() {
  // check availability of env

  // HTTP server docked
  const httpServer = http.createServer(app);
  // Socket.io server docked
  const chatIOSocket = new SocketClass(httpServer, genConsts.CHAT_SOCKET);
  logger.info(`${chatIOSocket.name} socket has been connected`);
  // todo: create webRTC socket as well
  // fix: this uses createChatChannel(chatIOSocket)
  chatSocketHandler(chatIOSocket);
  // handle runtime ignored errors
  Exception.unhandledRejection(httpServer);
  Exception.unhandledException();
  // connect the database here
  await connectMongo();
  // listener
  const { ENV, PORT } = serverConfig;
  httpServer.listen(PORT, () => {
    logger.info(`${ENV.toUpperCase()} 💯server listening at localhost:${PORT}`);
  });
}

main();
