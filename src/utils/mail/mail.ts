import nodemailer from "nodemailer";
import { HttpStatusCode } from "axios";
import serverConfig from "../../constants/config";
import ProgrammingError from "../../error/technical/ProgrammingError";
import { TMailMessage } from "./mail.type";
import APIError from "../../error/application/APIError";
import { OperationalType } from "../../error/error.type";

async function sendMail(receiver: string, mailMessage: TMailMessage) {
  const { MAIL_USER, MAIL_PASSWORD } = serverConfig;
  if (!MAIL_USER || !MAIL_PASSWORD)
    throw new ProgrammingError("MAIL details not provided!");

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      // secure: true,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: MAIL_USER,
      to: receiver,
      ...mailMessage,
    };
    await transporter.verify();

    return await transporter.sendMail(mailOptions);
  } catch (errorSendinMAIL: any) {
    throw new APIError(
      errorSendinMAIL.message,
      HttpStatusCode.InternalServerError,
      OperationalType.Network
    );
  }
}

export default sendMail;
