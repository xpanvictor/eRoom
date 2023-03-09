import { Request, Response, NextFunction } from "express";
import logError from "../utils/logError";
import ProgrammingError from "../error/technical/ProgrammingError";
import { ModifiedRequest, ResponseObject } from "./base.types";
import responseSchema from "./schemas/base.schema";

class BaseController {
  req: ModifiedRequest;

  protected res: Response;

  protected next: NextFunction;

  // response data generated
  private _respData: Partial<ResponseObject> = {};

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req as ModifiedRequest; // find a way to justify this
    this.res = res;
    this.next = next;
  }

  public populateData(value: Partial<ResponseObject>) {
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
    this.res.status(validatedResponse?.statusCode).json(validatedResponse);
    return 0;
  }
}

export default BaseController;
