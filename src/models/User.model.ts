import mongoose from "mongoose";
import IUser from "../services/user/user.service";

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
  classes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Class",
    },
  ],
});

export default mongoose.model<IUser>("User", UserSchema);
