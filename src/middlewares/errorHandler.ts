import { NextFunction, Request, Response } from "express";
import BaseController from "../controllers";
import StandardError from "../error";
import logError from "../utils/logError";

function ErrorHandler(
  error: StandardError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // check if error has been responded to
  if (res.headersSent) return next(error);
  const baseControllerToRespond = new BaseController(req, res, next);
  baseControllerToRespond.populateData({
    message: error.message,
    statusCode: error.httpStatusCode,
    result: error.description ?? error.stack,
  });
  baseControllerToRespond.respond();
  if (!error.is_operational) logError(error);
  next();
}

export default ErrorHandler;
