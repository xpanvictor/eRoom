import { Socket } from "socket.io";
import { Listener } from "../../lib/types/socket/events.type";
import ProgrammingError from "../../error/technical/ProgrammingError";
import wrapMiddlewareToSocket from "../../lib/chatChannel/WrapToSocket";
import userSourcingMiddleware from "../userSourcing.middleware";

// ! this breaks TS rules as masking of socket object has to be done
const userSourcingToSocket: Listener<Socket> = (socket, next) => {
  const WrapperFn = wrapMiddlewareToSocket(userSourcingMiddleware);
  if (!next) {
    throw new ProgrammingError("Next function not passed to middleware");
  }
  // mask authentication object
  // eslint-disable-next-line no-param-reassign
  socket.request.headers.authorization =
    socket.handshake.auth.token || socket.request.headers.authorization;

  WrapperFn(socket, next);
};

export default userSourcingToSocket;
