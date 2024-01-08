// Following SRP principle
// Each class represents just one functionality

import { MongooseError } from "mongoose";
import { HttpStatusCode } from "axios";
import BaseController from "../index";
import UserDataSchema from "../schemas/user.schema";
import APIError from "../../error/application/APIError";
import { OperationalType } from "../../error/error.type";
import User from "../../models/User.model";
import { TMailMessage } from "../../utils/mail/mail.type";
import UserService from "../../services/user/user.service";
import DatabaseError from "../../error/application/DatabaseError";

class RegisterUser extends BaseController {
  public async execute(): Promise<void> {
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

      const mailMessage: TMailMessage = {
        subject: "Welcome to eClass",
        text: `Welcome ${newUser.name} to eClass. Follow up by verifying your account!`,
      };
      await new UserService(newUser).sendMail(mailMessage);

      this.populateData({
        message: `User ${newUser.username} created successfully`,
        result: newUser,
        statusCode: HttpStatusCode.Created,
      });
    } catch (errorCreatingUser) {
      if (errorCreatingUser instanceof APIError) throw errorCreatingUser;
      return this.next(new DatabaseError(errorCreatingUser as MongooseError));
    }
  }
}

export default RegisterUser;
