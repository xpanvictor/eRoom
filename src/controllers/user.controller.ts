import { HttpStatusCode } from "axios";
import { MongooseError } from "mongoose";
import BaseController from "./index";
import UserDataSchema, {
  UserLoginSchema,
  UserOTPSchema,
  UserTokenSchema,
  VerifyUserSchema,
} from "./schemas/user.schema";
import APIError from "../error/application/APIError";
import { OperationalType } from "../error/error.type";
import User from "../models/User.model";
import DatabaseError from "../error/application/DatabaseError";
import {
  OTPFeautures,
  OTPStruct,
  TokenStruct,
  TokenType,
  VerificationActions,
} from "../services/user/user.type";
import { generatePin } from "../utils/crypt/otp";
import { TMailMessage } from "../utils/mail/mail.type";
import { decodeJWT, encodeJWT } from "../utils/crypt/jwt";
import ProgrammingError from "../error/technical/ProgrammingError";
import UserService from "../services/user/user.service";

class UserController extends BaseController {
  // post request to Register user
  public async userRegister() {
    // first fetch user object from request
    const userDetails = this.req.body;
    // validate and sanitize data
    const { error: errorValidating, value: validatedUserDetails } =
      UserDataSchema.validate(userDetails);

    if (errorValidating) {
      return this.next(
        new APIError(
          errorValidating.message,
          HttpStatusCode.BadRequest,
          OperationalType.InvalidInput
        )
      );
    }

    try {
      // create user for database
      const newUser = new User(validatedUserDetails);
      await newUser.save();
      // todo: user service generate tokens
      // generate otp and send

      this.populateData({
        message: `User ${newUser.username} created successfully`,
        result: newUser,
        statusCode: HttpStatusCode.Created,
      });
    } catch (errorCreatingUser) {
      if (errorCreatingUser instanceof APIError) throw errorCreatingUser;
      return this.next(new DatabaseError(errorCreatingUser as MongooseError));
    }
    return this.respond();
  }

  // post request to verify user
  public async verifyUser() {
    const rawPayload = this.req.body;
    const { error: payloadError, value: payload } =
      VerifyUserSchema.validate(rawPayload);
    // ensure user class in req body
    const authenticatedUser = this.req.user;
    if (!authenticatedUser)
      return this.next(
        new ProgrammingError("User not filled from authentication middleware")
      );

    const lengthOfPin = 6;

    if (payloadError)
      return this.next(
        new APIError(
          payloadError.message,
          HttpStatusCode.BadRequest,
          OperationalType.InvalidInput
        )
      );
    // switch to make endpoint for two actions, default is verify otp
    switch (payload.action) {
      // --------------------getOTP--------------------------------
      case VerificationActions.getOTP:
        try {
          const pin = generatePin(lengthOfPin);
          // create otp object using jwt
          const otp = encodeJWT<OTPStruct>(
            {
              otp: pin.toString(),
              feature: OTPFeautures.verification,
            },
            UserOTPSchema,
            "1d"
          );
          // save otp for user
          await authenticatedUser.updateUser({ otp });
          // send pin through mail service; todo: format message
          const mailMessage: TMailMessage = {
            subject: "Verify yourself",
            message: `Use this otp to verify yourself: ${pin}`,
          };
          await authenticatedUser.sendMail(mailMessage);

          this.populateData({
            message: "Mail sent",
            result: `Check your email: ${authenticatedUser.user.email}`,
          });
          this.respond();
        } catch (error: any) {
          this.next(
            new APIError(error.message, HttpStatusCode.InternalServerError)
          );
        }
        break;
      // ------------------verifyOTP----------------------------------
      default: // case VerificationActions.verifyOTP
        try {
          // check if user has been verified already
          if (authenticatedUser.user.verified)
            return this.next(
              new APIError(
                "User has been verified already",
                HttpStatusCode.Conflict,
                OperationalType.DuplicateRequest
              )
            );
          const otpPayload = decodeJWT<OTPStruct>(
            authenticatedUser.user.otp,
            UserOTPSchema
          );
          if (otpPayload.feature !== OTPFeautures.verification)
            return this.next(
              new APIError(
                "Invalid verification sequence",
                HttpStatusCode.BadRequest,
                OperationalType.AuthenticationFailed
              )
            );
          // check if otp is correct
          if (payload.otp !== otpPayload.otp)
            return this.next(
              new APIError(
                "OTP pin not correct",
                HttpStatusCode.BadRequest,
                OperationalType.AuthenticationFailed
              )
            );
          // otp is correct, we can verify user
          await authenticatedUser.updateUser({ verified: true });

          this.populateData({
            message: "Successfully verified user",
            result: authenticatedUser.user.username,
            statusCode: HttpStatusCode.Created,
          });
          this.respond();
        } catch (errorValidating: any) {
          this.next(errorValidating);
        }
        break;
    }
    return 0;
  }

  // post request to user login
  public async userLogin() {
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
    return this.respond();
  }
}

export default UserController;
