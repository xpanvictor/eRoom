export enum EventEnums {
  connection = "connection",
  disconnect = "disconnect",
  message = "message",
  joinsRoom = "joinsRoom",
  leavesRoom = "leavesRoom",
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
  },
};

export type Listener<TPayload> = (
  payload: TPayload,
  callBack?: (...args: any[]) => void
) => void;

export default EventsMonitored;
