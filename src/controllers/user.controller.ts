import BaseController from "./index";

class UserController extends BaseController {
  public userLogin() {
    console.log("Login request received");
    this.respond();
  }
}

export default UserController;
