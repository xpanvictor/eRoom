import nodemailer from "nodemailer";
import { HttpStatusCode } from "axios";
import { MailOptions } from "nodemailer/lib/smtp-pool";
import serverConfig from "../../constants/config";
import ProgrammingError from "../../error/technical/ProgrammingError";
import { TMailMessage } from "./mail.type";
import APIError from "../../error/application/APIError";
import { OperationalType } from "../../error/error.type";

async function sendMail(receiver: string, mailMessage: TMailMessage) {
  const { MAIL_USER, MAIL_PASSWORD, DOMAIN } = serverConfig;
  if (!MAIL_USER || !MAIL_PASSWORD)
    throw new ProgrammingError("MAIL details not provided!");

  try {
    // todo: smtp server fails
    const transporter = nodemailer.createTransport({
      host: "smtp.mailgun.org",
      port: 587,
      service: "Mailgun",
      // secure: true,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    });

    const mailOptions: MailOptions = {
      from: DOMAIN,
      to: receiver,
      ...mailMessage,
    };
    await transporter.verify();

    return await transporter.sendMail(mailOptions);
  } catch (errorSendingMAIL: any) {
    throw new APIError(
      errorSendingMAIL.message,
      HttpStatusCode.InternalServerError,
      OperationalType.Network
    );
  }
}

export default sendMail;
