import { HttpStatusCode } from "axios";
import { Request } from "express";
import UserService from "../services/user/user.service";

export interface ResponseObject {
  // the message passed, non-technical
  message: string;
  // status description; optional
  statusCode: HttpStatusCode;
  status?: string;
  result: Record<string, any> | string;
}

export interface ModifiedRequest extends Request {
  user?: UserService;
}
