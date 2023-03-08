import { HttpStatusCode } from "axios";

export interface ResponseObject {
  // the message passed, non-technical
  message: string;
  // status description; optional
  statusCode: HttpStatusCode;
  status?: string;
  result: Record<string, any> | string;
}
