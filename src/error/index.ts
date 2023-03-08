import { HttpStatusCode } from "axios";
import { ErrorTypes } from "./error.type";

class StandardError extends Error {
  public error_type: ErrorTypes;

  public description: any;

  public readonly httpStatusCode: HttpStatusCode;

  public readonly is_operational: boolean;

  public readonly timestamp: Date;

  constructor(
    msg: string | Error,
    error_type: ErrorTypes,
    httpStatusCode: HttpStatusCode,
    description?: any
  ) {
    super(msg instanceof Error ? msg.message : msg);
    this.description = description ?? this.message;
    // set error object prototype
    Object.setPrototypeOf(this, new.target.prototype);
    this.httpStatusCode = httpStatusCode;
    this.timestamp = new Date();
    this.error_type = error_type;
    this.is_operational = this.error_type === ErrorTypes.Operational;

    Error.captureStackTrace(this);
  }
}

export default StandardError;
