import { HttpStatusCode } from "axios";
import BaseController from "../index";
import { UserOTPSchema, VerifyUserSchema } from "../schemas/user.schema";
import ProgrammingError from "../../error/technical/ProgrammingError";
import APIError from "../../error/application/APIError";
import { OperationalType } from "../../error/error.type";
import {
  OTPFeautures,
  OTPStruct,
  VerificationActions,
} from "../../services/user/user.type";
import { generatePin } from "../../utils/crypt/otp";
import { decodeJWT, encodeJWT } from "../../utils/crypt/jwt";
import { TMailMessage } from "../../utils/mail/mail.type";

class VerifyUser extends BaseController {
  public async execute(): Promise<void> {
    const rawPayload = this.req.body;
    const { error: payloadError, value: payload } =
      VerifyUserSchema.validate(rawPayload);
    // ensure user class in req body
    const authenticatedUser = this.req.user;
    if (!authenticatedUser)
      return this.next(
        new ProgrammingError("User not filled from authentication middleware")
      );

    const lengthOfPin = 6;

    if (payloadError)
      return this.next(
        new APIError(
          payloadError.message,
          HttpStatusCode.BadRequest,
          OperationalType.InvalidInput
        )
      );
    // switch to make endpoint for two actions, default is verify otp
    switch (payload.action) {
      // --------------------getOTP--------------------------------
      case VerificationActions.getOTP:
        try {
          const pin = generatePin(lengthOfPin);
          // create otp object using jwt
          const otp = encodeJWT<OTPStruct>(
            {
              otp: pin.toString(),
              feature: OTPFeautures.verification,
            },
            UserOTPSchema,
            "1d"
          );
          // save otp for user
          await authenticatedUser.updateUser({ otp });
          // send pin through mail service; todo: format message
          const mailMessage: TMailMessage = {
            subject: "Verify yourself",
            text: `Use this otp to verify yourself: ${pin}`,
          };
          await authenticatedUser.sendMail(mailMessage);

          this.populateData({
            message: "Mail sent",
            result: `Check your email: ${authenticatedUser.user.email}`,
          });
        } catch (error: any) {
          this.next(
            new APIError(error.message, HttpStatusCode.InternalServerError)
          );
        }
        break;
      // ------------------verifyOTP----------------------------------
      default: // case VerificationActions.verifyOTP
        try {
          // check if user has been verified already
          if (authenticatedUser.user.verified)
            return this.next(
              new APIError(
                "User has been verified already",
                HttpStatusCode.Conflict,
                OperationalType.DuplicateRequest
              )
            );
          const otpPayload = decodeJWT<OTPStruct>(
            authenticatedUser.user.otp,
            UserOTPSchema
          );
          if (otpPayload.feature !== OTPFeautures.verification)
            return this.next(
              new APIError(
                "Invalid verification sequence",
                HttpStatusCode.BadRequest,
                OperationalType.AuthenticationFailed
              )
            );
          // check if otp is correct
          if (payload.otp !== otpPayload.otp)
            return this.next(
              new APIError(
                "OTP pin not correct",
                HttpStatusCode.BadRequest,
                OperationalType.AuthenticationFailed
              )
            );
          // otp is correct, we can verify user
          await authenticatedUser.updateUser({ verified: true });

          this.populateData({
            message: "Successfully verified user",
            result: authenticatedUser.user.username,
            statusCode: HttpStatusCode.Created,
          });
        } catch (errorValidating: any) {
          this.next(errorValidating);
        }
        break;
    }
  }
}

export default VerifyUser;
