import { NextFunction, Request, Response, Router } from "express";
import { RouteMethods } from "./routes.type";
import { APIRoutesValues } from "./APIRoutes";

class RouterClass {
  private readonly _routerElement: Router;

  private readonly _name: string;

  constructor(name = "anonymous") {
    this._routerElement = Router();
    this._name = name;
  }

  get routerElement() {
    return this._routerElement;
  }

  public registerRoute(
    // the http method to use, RouteMethods enum
    method: RouteMethods,
    // the path to listen, use APIRoutes object
    path: APIRoutesValues,
    // the path listener function, feeds in req, res and next; return void
    listener: (req: Request, res: Response, next: NextFunction) => void
  ) {
    this._routerElement[method](path, listener);
  }
}

export default RouterClass;
