import { HttpStatusCode } from "axios";
import { MongooseError } from "mongoose";
import BaseController from "./index";
import UserDataSchema, { VerifyUserSchame } from "./schemas/user.schema";
import APIError from "../error/application/APIError";
import { OperationalType } from "../error/error.type";
import User from "../models/User.model";
import DatabaseError from "../error/application/DatabaseError";
import { VerificationActions } from "../services/user/user.type";
import { generatePin } from "../utils/crypt/otp";

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

  public async verifyUser() {
    const rawPayload = this.req.body;
    const { error: payloadError, value: payload } =
      VerifyUserSchame.validate(rawPayload);

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
      case VerificationActions.getOTP:
        try {
          const pin = generatePin(lengthOfPin);
          const authenticatedUser = this.req.user;
          // todo: create otp object using jwt
          // todo: save otp for user
          authenticatedUser?.sendMail(pin);
          // send pin through mail service
          // todo: useful response object
          this.populateData({
            message: "user otp",
          });
        } catch (errorGeneratingPin) {
          this.next(errorGeneratingPin);
        }
        return this.respond();
      default: // case VerificationActions.verifyOTP
        return this.respond();
    }
  }

  public userLogin() {
    console.log("Login request received");
    this.respond();
  }
}

export default UserController;
