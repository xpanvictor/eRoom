import StandardError from "../index";
import { ErrorTypes, OperationalType } from "../error.type";
import { HttpStatusCode } from "axios";

class APIError extends StandardError {
  public readonly operational_type: OperationalType;

  constructor(
    message: string,
    httpStatusCode: HttpStatusCode,
    operationalType: OperationalType = OperationalType.Network
  ) {
    super(message, ErrorTypes.Operational, httpStatusCode);
    this.operational_type = operationalType;
  }
}

export default APIError;
