import Joi from "joi";
import IUser, {
  OTPStruct,
  TokenStruct,
  TokenType,
  VerificationActions,
  VerificationPayload,
} from "../../services/user/user.type";

export const defaultAvatar =
  "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.winhelponline.com%2Fblog%2Freplace-default-user-account-picture-avatar-windows-10%2F&psig=AOvVaw3kW5z5H8elLbppdumdJou3&ust=1678381923482000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCOj-rZ7qzP0CFQAAAAAdAAAAABAE";

export const passwordRegex = /$/;

const emailSchema = Joi.string().email();

const UserDataSchema = Joi.object<IUser>().keys({
  name: Joi.string().required().trim(),
  email: emailSchema.required(),
  avatar: Joi.string().default(defaultAvatar),
  username: Joi.string().required().min(3).trim(),
  password: Joi.string()
    .required()
    .min(8)
    .regex(passwordRegex)
    .message("Password not secure"),
});

export const UserLoginSchema = Joi.object<
  Pick<IUser, "password"> & Pick<IUser, "username" | "email">
>()
  .keys({
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
  })
  .or("username", "email");

export const UserTokenSchema = Joi.object<TokenStruct>().keys({
  type: Joi.any().allow(...Object.values(TokenType)),
  payload: Joi.object({
    email: emailSchema.required(),
  }),
});

const userOTP = Joi.string().length(6);

export const VerifyUserSchame = Joi.object<VerificationPayload>().keys({
  action: Joi.any()
    .allow(...Object.values(VerificationActions))
    .default(VerificationActions.verifyOTP),
  otp: userOTP.when("action", {
    is: VerificationActions.verifyOTP,
    then: Joi.required(),
  }),
});

export const UserOTPSchema = Joi.object<OTPStruct>().keys({
  otp: userOTP,
  feature: Joi.string(),
  iat: Joi.date(),
  exp: Joi.date(),
});

export default UserDataSchema;
