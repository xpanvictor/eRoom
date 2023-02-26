import { NextFunction, Request, Response } from "express";

function ErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // check if error has been responded to
  if (res.headersSent) return next(error);
}

export default ErrorHandler;
