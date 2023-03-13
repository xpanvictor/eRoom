import { Server, Socket } from "socket.io";
import helmet from "helmet";
import * as http from "http";
import { EventEnums } from "../../lib/types/socket/events.type";
import ChildSocket from "./ChildSocket";
import userSourcingToSocket from "../../middlewares/socket/userSourcing.middleware";

class SocketClass {
  protected readonly _socketServer: Server;

  public readonly name: string;

  constructor(httpServer: http.Server, name = "Chat Socket") {
    this._socketServer = new Server(httpServer, {});
    // sanitization
    this._socketServer.engine.use(helmet());
    this.name = name;
    // -------------mounting io middlewares------------------
    // 1. user sourcing middleware
    this._socketServer.use(userSourcingToSocket);
  }

  get socketServer() {
    return this._socketServer;
  }

  public attachListener(
    toWatchEvent: EventEnums,
    listener: (modifiedSocket?: ChildSocket) => void
  ) {
    this._socketServer.on(toWatchEvent, (socket: Socket) =>
      listener(new ChildSocket(socket))
    );
  }
}

export default SocketClass;
