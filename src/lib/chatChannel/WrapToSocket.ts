import { Socket } from "socket.io";
import { NextFunction, Response } from "express";
import { ListenerType } from "../../routes/routes.type";
import { ModifiedRequest } from "../../controllers/base.types";

export default function wrapMiddlewareToSocket(middleware: ListenerType) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const dummyRes: Response = {
    headersSent: false,
  };
  return function Wrapper(socket: Socket, next: NextFunction) {
    middleware(socket.request as ModifiedRequest, dummyRes, next);
  };
}
