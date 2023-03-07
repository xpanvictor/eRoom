import { Model, Types } from "mongoose";

enum IUserType {
  student,
  instructor,
}

interface IClassesBelonged {
  // unique class Id to identify class
  class_id: string;
  // type user is in class
  user_type: IUserType;
}

interface IUser {
  // compulsory id of the user
  id: Types.ObjectId;
  // the user's name
  name: string;
  // user's image
  avatar: string;
  // required unique username
  username: string;
  // user's password
  password: string;
  // verified: is user's email verified
  verified: boolean;
  // email of the user
  email: string;
  // classes: Aligns to array of user's classes with type of membership
  classes: Types.Array<IClassesBelonged>;
  // todo: map out remaining user type
}

export interface IUserMethods {
  // method that verifies user's password with bcrypt
  verifyPassword: (password: string) => Promise<boolean>;
}

export type UserModel = Model<IUser, object, IUserMethods>;

export default IUser;