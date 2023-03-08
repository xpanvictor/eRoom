import { HttpStatusCode } from "axios";
import { MongooseError } from "mongoose";
import BaseController from "./index";
import UserDataSchema from "./schemas/user.schema";
import APIError from "../error/application/APIError";
import { OperationalType } from "../error/error.type";
import User from "../models/User.model";
import DatabaseError from "../error/application/DatabaseError";

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
      this.populateData({
        message: `User ${newUser.username} created successfully`,
        result: newUser,
        statusCode: HttpStatusCode.Created,
      });
    } catch (errorCreatingUser) {
      if (errorCreatingUser instanceof APIError) throw errorCreatingUser;
      console.log(errorCreatingUser);
      return this.next(new DatabaseError(errorCreatingUser as MongooseError));
    }
    return this.respond();
  }

  public userLogin() {
    console.log("Login request received");
    this.respond();
  }
}

export default UserController;
