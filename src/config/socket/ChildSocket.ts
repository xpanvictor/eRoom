import { Event, Socket } from "socket.io";
import { EventEnums, Listener } from "../../lib/types/socket/events.type";

class ChildSocket {
  private readonly _socket: Socket;

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
      middlewares.forEach((middleware) => {
        this._socket.use((socket, next) => middleware(socket, next));
      });
      return listener(payload, cb);
    });
  }
}

export default ChildSocket;
