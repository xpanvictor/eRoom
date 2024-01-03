import { Server, Socket } from "socket.io";
import helmet from "helmet";
import * as http from "http";
import {
  EventEnums,
  ModifiedSocket,
  TNamespaceIDs,
} from "../../lib/types/socket/events.type";
import ChildSocket from "./ChildSocket";
import userSourcingToSocket from "../../middlewares/socket/userSourcing.middleware";
// import createChatChannel from "../../lib/chatChannel/manager";

class SocketClass {
  protected readonly _socketServer: Server;

  public readonly name: string;

  constructor(httpServer: http.Server, name: string) {
    this._socketServer = new Server(httpServer, {});
    // sanitization
    this._socketServer.engine.use(helmet());
    this.name = name;
    // -------------mounting io middlewares------------------
    // 1. user sourcing middleware
    this._socketServer.use((socket, next) =>
      userSourcingToSocket(socket, {} as ModifiedSocket, next)
    );
  }

  get socketServer() {
    return this._socketServer;
  }

  public initiateNamespaces(namespaceIDs: TNamespaceIDs) {
    namespaceIDs.forEach((namespaceId) => {
      this._socketServer.of(namespaceId);
    });
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
