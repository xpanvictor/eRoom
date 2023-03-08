import Joi from "joi";

export interface ResponseObject {
  // the message passed, non-technical
  message: string;
  // status description; optional
  status?: string;
  result: Record<string, any>;
}

export const responseSchema = Joi.object<ResponseObject>({
  message: Joi.string().required(),
  result: Joi.object().required(),
  status: Joi.string(),
});
