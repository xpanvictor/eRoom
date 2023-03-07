import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { HttpStatusCode } from "axios";
import IUser from "../services/user/user.service";
import APIError from "../error/application/APIError";
import { OperationalType } from "../error/error.type";

const UserSchema = new mongoose.Schema<IUser>({
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
  classes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Class",
    },
  ],
});

// methods definition
UserSchema.pre("save", function hashPassword(next) {
  // check if password is present and is modified
  if (this.password && this.isModified("password")) {
    const saltRounds = 10;
    bcrypt.hash(this.password, saltRounds, (error, hashedPassword) => {
      if (error)
        throw new APIError(
          "Can't hash password!",
          HttpStatusCode.BadRequest,
          OperationalType.InvalidInput
        );
      this.password = hashedPassword;
    });
  }
  next();
});

export default mongoose.model<IUser>("User", UserSchema);
