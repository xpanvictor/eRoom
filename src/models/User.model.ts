import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { HttpStatusCode } from "axios";
import IUser, { IUserMethods, UserModel } from "../services/user/user.type";
import APIError from "../error/application/APIError";
import { OperationalType } from "../error/error.type";
import { defaultAvatar } from "../controllers/schemas/user.schema";

const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: [true, "Username is required!"],
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email must be provided"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: [8, "Password must be longer than 8 characters"],
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: defaultAvatar,
    },
    otp: {
      type: String,
      default: "",
    },
    classes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Class",
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.verifyPassword = async function verifyPassword(password) {
  return bcrypt.compare(password, (<IUser>(<unknown>this)).password);
};
// methods definition
// hashing the password
UserSchema.pre("save", async function hashPassword(next) {
  // check if password is present and is modified
  if (this.password && this.isModified("password")) {
    const saltRounds = 10;
    try {
      this.password = await bcrypt.hash(this.password, saltRounds);
    } catch (errorHashing) {
      throw new APIError(
        "Can't hash password!",
        HttpStatusCode.BadRequest,
        OperationalType.InvalidInput
      );
    }
  }
  next();
});

export default mongoose.model<IUser, UserModel>("User", UserSchema);
