import { HttpStatusCode } from "axios";
import BaseController from "../index";
import { UserLoginSchema, UserTokenSchema } from "../schemas/user.schema";
import APIError from "../../error/application/APIError";
import { OperationalType } from "../../error/error.type";
import User from "../../models/User.model";
import UserService from "../../services/user/user.service";
import { encodeJWT } from "../../utils/crypt/jwt";
import { TokenStruct, TokenType } from "../../services/user/user.type";

// post request to user login
class LoginUser extends BaseController {
  async execute(): Promise<void> {
    // first retrieve payload and validate
    const rawPayload = this.req.body;
    const { error: payloadError, value: payload } =
      UserLoginSchema.validate(rawPayload);
    if (payloadError)
      return this.next(
        new APIError(
          payloadError.message,
          HttpStatusCode.BadRequest,
          OperationalType.InvalidInput
        )
      );

    const fetchedUser = await User.findOne(
      payload.email ? { email: payload.email } : { username: payload.username }
    ).select("+password");
    if (!fetchedUser)
      return this.next(
        new APIError(
          `User ${payload?.email || payload?.username} does not exist`,
          HttpStatusCode.BadRequest,
          OperationalType.AuthenticationFailed
        )
      );

    // verify user password
    const userVerified = await fetchedUser.verifyPassword(payload.password);
    if (!userVerified)
      return this.next(
        new APIError(
          "Provided password is wrong",
          HttpStatusCode.BadRequest,
          OperationalType.AuthenticationFailed
        )
      );

    const authenticatedUser = new UserService(fetchedUser);
    // verification success
    // access token generation
    const accessToken = encodeJWT<TokenStruct>(
      {
        type: TokenType.access,
        payload: { email: authenticatedUser.user.email },
      },
      UserTokenSchema,
      "1d"
    );
    await authenticatedUser.updateUser({ accessToken });

    this.populateData({
      message: `User ${authenticatedUser.user.username} authenticated successfully`,
      statusCode: HttpStatusCode.Ok,
      result: {
        accessToken,
        avatar: authenticatedUser.user.avatar,
      },
      status: "Authentication success",
    });
  }
}

export default LoginUser;
