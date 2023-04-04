import { Document, Model, Types } from "mongoose";

enum IUserType {
  student,
  instructor,
}

export enum VerificationActions {
  // gets the otp
  getOTP = "getOTP",
  // verify the otp
  verifyOTP = "verifyOTP",
}

export enum OTPFeautures {
  verification = "verification",
}

export enum TokenType {
  access = "access",
  refresh = "refresh",
}

export interface VerificationPayload {
  action: VerificationActions;
  otp?: string;
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
  // otp for otpfeatures
  otp: string;
  // access token
  accessToken: string;
  // classes: Aligns to array of user's classes with type of membership
  classes: Types.Array<IClassesBelonged>;
  // all chat channels
  chatChannels: Types.Array<string>;
  // todo: map out remaining user type
}

interface JWTBase {
  iat?: Date;
  exp?: Date;
}

export interface OTPStruct extends JWTBase {
  feature: OTPFeautures;
  otp: string;
}

export interface TokenStruct extends JWTBase {
  type: TokenType;
  payload: {
    email: string;
  };
}

export interface IUserMethods {
  // method that verifies user's password with bcrypt
  verifyPassword: (password: string) => Promise<boolean>;
}

export type UserModel = Model<IUser, object, IUserMethods>;

export type UserDocument = IUser & Document;

export default IUser;
