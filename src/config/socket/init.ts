import { Server, Socket } from "socket.io";
import * as http from "http";
import { EventEnums } from "../../lib/types/socket/events.type";
import ChildSocket from "./ChildSocket";

class SocketClass {
  protected readonly _socketServer: Server;

  public readonly name: string;

  constructor(httpServer: http.Server, name = "Chat Socket") {
    this._socketServer = new Server(httpServer, {});
    this.name = name;
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
