import mongoose from "mongoose";
import IUser from "../services/user/user.service";

const UserSchema = new mongoose.Schema<IUser>({});

module.exports = mongoose.model("User", UserSchema);
