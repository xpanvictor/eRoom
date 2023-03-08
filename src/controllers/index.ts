import { Request, Response, NextFunction } from "express";
import logError from "../utils/logError";
import ProgrammingError from "../error/technical/ProgrammingError";
import { ResponseObject, responseSchema } from "./base.types";

class BaseController {
  req: Request;

  protected res: Response;

  protected next: NextFunction;

  // response data generated
  private _respData: Partial<ResponseObject> = {};

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
    const { error: errorValidating, value: validatedResponse } =
      responseSchema.validate(this._respData);
    if (errorValidating) throw new ProgrammingError(errorValidating.message);
    this.res.json(validatedResponse);
    return 0;
  }
}

export default BaseController;
