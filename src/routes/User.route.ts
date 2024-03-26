import BaseRouter from "./baseRouter";
import { RouteMethods } from "./routes.type";
import APIRoutes from "./APIRoutes";
import UserSourcingMiddleware from "../middlewares/userSourcing.middleware";
import RegisterUser from "../controllers/user.service/register.user";
import LoginUser from "../controllers/user.service/login.user";
import VerifyUser from "../controllers/user.service/verify.user";

const UserRouter = new BaseRouter("User router");

// here we mount the user authentication flow

/*
 * POST /login
 * body:
 *   username?: string,
 *   password: alphanum,
 *   email?: string
 * username or email works
 * */
UserRouter.registerRoute(RouteMethods.POST, APIRoutes.userLogin, LoginUser);

/*
 * POST /register
 * body:
 *   username: string,
 *   password: alphanum,
 *   email: string,
 *   dob: Date Nullable,
 *   // others
 * */
UserRouter.registerRoute(
  RouteMethods.POST,
  APIRoutes.userRegister,
  RegisterUser
);

/*
 * POST /verify-user
 * body:
 *   action: getOTP | verifyOTP (default),
 *   otp?: number required for verifyOTP
 * */
UserRouter.registerRoute(RouteMethods.POST, APIRoutes.userVerify, VerifyUser, [
  UserSourcingMiddleware,
]);

export default UserRouter.routerElement;
