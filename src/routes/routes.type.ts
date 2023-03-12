import { NextFunction, Response } from "express";
import { ModifiedRequest } from "../controllers/base.types";

export enum RouteMethods {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

export interface DRouteConfig {
  // method: the REST method used to call path
  method: RouteMethods;
  // path: the path string called by method
  path: string;
}

export type ListenerType = (
  req: ModifiedRequest,
  res: Response | Record<string, any>,
  next: NextFunction
) => void;
