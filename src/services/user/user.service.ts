import { UserDocument } from "./user.type";

class UserService {
  public readonly user: UserDocument;

  constructor(user: UserDocument) {
    this.user = user;
  }

  // todo: make message type
  public sendMail(message: string | number) {
    console.log(message, this.user.name);
  }
}

export default UserService;
