import { HttpStatusCode } from "axios";
import IUser, { UserDocument } from "./user.type";
import sendMail from "../../utils/mail/mail";
import { TMailMessage } from "../../utils/mail/mail.type";
import APIError from "../../error/application/APIError";
import { OperationalType } from "../../error/error.type";
import DatabaseError from "../../error/application/DatabaseError";

class UserService {
  public user: UserDocument;

  constructor(user: UserDocument) {
    this.user = user;
  }

  // todo: make message type
  public async sendMail(message: TMailMessage) {
    try {
      await sendMail(this.user.email, message);
    } catch (errorSendingMail: any) {
      throw new APIError(
        errorSendingMail.message,
        HttpStatusCode.InternalServerError,
        OperationalType.Network
      );
    }
  }

  // update anything in user
  public async updateUser(toModifyData: Partial<IUser>) {
    try {
      // todo: schema to validate action
      this.user = Object.assign(this.user, toModifyData);
      await this.user.save();
    } catch (errorUpdatingUser) {
      throw new DatabaseError(errorUpdatingUser);
    }
  }
}

export default UserService;
