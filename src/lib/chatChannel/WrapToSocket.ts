import { Socket } from "socket.io";
import { NextFunction } from "express";
import { ListenerType } from "../../routes/routes.type";
import { ModifiedRequest } from "../../controllers/base.types";

export default function wrapMiddlewareToSocket(middleware: ListenerType) {
  return function Wrapper(socket: Socket, next: NextFunction) {
    middleware(socket.request as ModifiedRequest, {}, next);
  };
}
