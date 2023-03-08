import { Socket } from "socket.io";
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
    listener: Listener<TPayload>
  ) {
    this._socket.on(toWatchEvent, listener);
  }
}

export default ChildSocket;
