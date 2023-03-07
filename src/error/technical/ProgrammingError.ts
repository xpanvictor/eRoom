import { HttpStatusCode } from "axios";
import StandardError from "../index";
import { ErrorTypes } from "../error.type";

class ProgrammingError extends StandardError {
  constructor(
    message: string,
    httpStatusCode = HttpStatusCode.InternalServerError
  ) {
    super(message, ErrorTypes.Programming, httpStatusCode);
  }
}

export default ProgrammingError;
