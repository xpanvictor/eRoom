import { HttpStatusCode } from "axios";
import { ListenerType } from "../routes/routes.type";
import User from "../models/User.model";
import APIError from "../error/application/APIError";
import { OperationalType } from "../error/error.type";
import UserService from "../services/user/user.service";

const UserSourcingMiddleware: ListenerType = async (req, res, next) => {
  // todo: make the jwt feature, for now return any user
  const username = "xpan";
  const user = await User.findOne({ username });
  if (!user)
    return next(
      new APIError(
        `User with username ${username} not found`,
        HttpStatusCode.Forbidden,
        OperationalType.AuthenticationFailed
      )
    );
  req.user = new UserService(user);
  return next();
};

export default UserSourcingMiddleware;
