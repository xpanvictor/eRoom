// import { MongooseError } from "mongoose";
import { HttpStatusCode } from "axios";
import StandardError from "../index";
import { ErrorTypes } from "../error.type";

class DatabaseError extends StandardError {
  constructor(error: any) {
    const { message } = error;
    const errs = [];
    if (error.name === "ValidationError") {
      errs.push(
        Object.values(error.errors).map(
          (err) => (<Record<string, string>>err).message
        )
      );
    }
    const description = {
      code: error.code,
      errors: errs,
      errC: JSON.stringify(error),
    };
    super(
      message,
      ErrorTypes.Operational,
      HttpStatusCode.BadRequest,
      description
    );
  }
}

export default DatabaseError;
