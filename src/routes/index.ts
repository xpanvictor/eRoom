import { Router } from "express";
import UserRouter from "./User.route";

const V1Router = Router();

// ***** User defined routes *****
V1Router.use("/user", UserRouter);

export default V1Router;
