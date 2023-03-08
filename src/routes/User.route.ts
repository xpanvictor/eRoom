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

// POST /register
UserRouter.registerRoute(RouteMethods.POST, APIRoutes.userRegister, (...args) =>
  new UserController(...args).userRegister()
);

export default UserRouter.routerElement;
