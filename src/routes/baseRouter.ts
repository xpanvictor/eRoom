import { Router } from "express";
import { ControllerType, ListenerType, RouteMethods } from "./routes.type";
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
    Listener: any, // todo: Fix the appropriate type (BaseController is an abstract)
    // listeners to append to route
    middlewares: Array<ListenerType> = []
  ) {
    this._routerElement[method](path, ...middlewares, (...args) =>
      new Listener(...args).execute_main()
    );
  }
}

export default RouterClass;
