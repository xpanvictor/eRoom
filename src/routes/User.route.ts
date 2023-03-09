import BaseRouter from "./baseRouter";
import { RouteMethods } from "./routes.type";
import APIRoutes from "./APIRoutes";
import UserController from "../controllers/user.controller";

const UserRouter = new BaseRouter("User router");

// here we mount the user authentication flow
// POST /login
UserRouter.registerRoute(RouteMethods.POST, APIRoutes.userLogin, (...args) =>
  new UserController(...args).userLogin()
);

/*
 * POST /register
 * body:
 *   username: string,
 *   password: alphanum,
 *   email: string,
 *   dob: Date Nullable,
 *   // others
 * */
UserRouter.registerRoute(RouteMethods.POST, APIRoutes.userRegister, (...args) =>
  new UserController(...args).userRegister()
);

/*
 * POST /verify-user
 * body:
 *   action: getOTP | verifyOTP (default),
 *   otp?: number required for verifyOTP
 * */
UserRouter.registerRoute(RouteMethods.POST, APIRoutes.userVerify, (...args) =>
  new UserController(...args).verifyUser()
);

export default UserRouter.routerElement;
