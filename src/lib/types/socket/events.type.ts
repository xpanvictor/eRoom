import { Socket } from "socket.io";
import { IncomingMessage } from "http";
import { ModifiedRequest } from "../../../controllers/base.types";

export enum EventEnums {
  connection = "connection",
  disconnect = "disconnect",
  message = "message",
  joinsRoom = "joinsRoom",
  leavesRoom = "leavesRoom",
  error = "error",
}

const EventsMonitored: Record<string, Record<string, EventEnums>> = {
  socketEvents: {
    connection: EventEnums.connection,
    disconnect: EventEnums.disconnect,
  },
  userDefined: {
    message: EventEnums.message,
    joinsRoom: EventEnums.joinsRoom,
    leavesRoom: EventEnums.leavesRoom,
    error: EventEnums.error,
  },
};

export interface ModifiedSocket extends Socket {
  request: ModifiedRequest & IncomingMessage;
  channelId: string;
}

export type Listener<TPayload> = (
  payload: TPayload,
  modifiedSocket: ModifiedSocket,
  callBack?: (...args: any[]) => void
) => void;

export default EventsMonitored;
