import Joi from "joi";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "axios";
import ProgrammingError from "../../error/technical/ProgrammingError";
import serverConfig from "../../constants/config";
import APIError from "../../error/application/APIError";
import { OperationalType } from "../../error/error.type";

export function encodeJWT<T>(
  rawPayload: T,
  payloadSchema: Joi.Schema,
  expiresIn: string
): string {
  const { error: errorValidating, value: payload } =
    payloadSchema.validate(rawPayload);
  if (!serverConfig.SECRET)
    throw new ProgrammingError("Secret key not provided");
  if (errorValidating) throw new ProgrammingError(errorValidating.message);
  if (!expiresIn) throw new ProgrammingError("Expiry period not provided!");
  return jwt.sign(payload, serverConfig.SECRET, {
    expiresIn,
  });
}

export function decodeJWT<T>(encodedJWT: string, payloadSchema: Joi.Schema): T {
  let decodedPayload: jwt.JwtPayload | string;
  if (!serverConfig.SECRET)
    throw new ProgrammingError("Secret key not provided");
  try {
    decodedPayload = jwt.verify(encodedJWT, serverConfig.SECRET);
  } catch (e) {
    throw new APIError(
      "Error validating jwt",
      HttpStatusCode.Forbidden,
      OperationalType.InvalidInput
    );
  }
  const { error: errorValidating, value: payload } =
    payloadSchema.validate(decodedPayload);
  if (errorValidating)
    throw new APIError(
      errorValidating.message,
      HttpStatusCode.BadRequest,
      OperationalType.InvalidInput
    );
  return payload;
}
