import { HttpStatusCode } from "axios";
import { ListenerType } from "../routes/routes.type";
import User from "../models/User.model";
import APIError from "../error/application/APIError";
import { OperationalType } from "../error/error.type";
import UserService from "../services/user/user.service";
import { decodeJWT } from "../utils/crypt/jwt";
import { TokenStruct, TokenType } from "../services/user/user.type";
import { UserTokenSchema } from "../controllers/schemas/user.schema";

const UserSourcingMiddleware: ListenerType = async (req, res, next) => {
  // first retrieve access token
  const rawAccessToken = req.headers.authorization;
  if (!rawAccessToken)
    return next(
      new APIError(
        "Access token not provided",
        HttpStatusCode.Forbidden,
        OperationalType.AuthenticationFailed
      )
    );

  const accessToken = rawAccessToken.split(" ")[1];
  let decodedToken: TokenStruct;
  try {
    decodedToken = decodeJWT<TokenStruct>(accessToken, UserTokenSchema);
    if (decodedToken.type !== TokenType.access)
      throw new APIError("Invalid access token", HttpStatusCode.Forbidden);
  } catch (errorValidatingSession) {
    return next(errorValidatingSession);
  }

  // user source to req
  const user = await User.findOne({ email: decodedToken.payload.email });
  if (!user)
    return next(
      new APIError(
        `User with email ${decodedToken.payload.email} not found`,
        HttpStatusCode.Forbidden,
        OperationalType.AuthenticationFailed
      )
    );
  // ! confirm if to prevent a different but valid access token
  req.user = new UserService(user);
  return next();
};

export default UserSourcingMiddleware;
