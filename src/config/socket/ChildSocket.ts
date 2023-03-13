import { Event, Socket } from "socket.io";
import {
  EventEnums,
  Listener,
  ModifiedSocket,
} from "../../lib/types/socket/events.type";

class ChildSocket {
  private readonly _socket: Socket | ModifiedSocket;

  constructor(socket: Socket) {
    this._socket = socket;
  }

  get elemSocket() {
    return this._socket;
  }

  public attachListener<TPayload>(
    toWatchEvent: EventEnums,
    listener: Listener<TPayload>,
    middlewares: Array<Listener<Event>> = []
  ) {
    this._socket.on(toWatchEvent, (payload: TPayload, cb: () => void) => {
      // middlewares array individual mounting
      middlewares.forEach((middleware) => {
        this._socket.use((socket, next) =>
          middleware(socket, this.elemSocket as ModifiedSocket, next)
        );
      });

      return listener(payload, this.elemSocket as ModifiedSocket, cb);
    });
  }
}

export default ChildSocket;
