import { HttpStatusCode } from "axios";
import { ErrorTypes } from "./error.type";

class StandardError extends Error {
  public error_type: ErrorTypes;

  public readonly httpStatusCode: HttpStatusCode;

  public readonly is_operational: boolean;

  public readonly timestamp: Date;

  constructor(
    msg: string | Error,
    error_type: ErrorTypes,
    httpStatusCode: HttpStatusCode
  ) {
    super(msg instanceof Error ? msg.message : msg);
    this.httpStatusCode = httpStatusCode;
    this.timestamp = new Date();
    this.error_type = error_type;
    this.is_operational = this.error_type === ErrorTypes.Operational;
  }
}

export default StandardError;
