import { Request, Response, NextFunction } from "express";
import logError from "../utils/logError";
import ProgrammingError from "../error/technical/ProgrammingError";

class BaseController {
  req: Request;

  protected res: Response;

  protected next: NextFunction;

  // response data generated
  private _respData: any; // todo: construct response type

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  public populateData(value: Record<string, any>) {
    this._respData = { ...this._respData, ...value };
  }

  public respond() {
    // first check if response has been made already
    if (this.res.headersSent)
      return logError(new ProgrammingError("Response sent"));
    // validate that response body satisfies requirements
    this.res.json(this._respData);
    return 0;
  }
}

export default BaseController;
