import Joi from "joi";
import { ResponseObject } from "../base.types";

const responseSchema = Joi.object<ResponseObject>({
  message: Joi.string().required(),
  result: Joi.alternatives([Joi.object(), Joi.string()]),
  status: Joi.string(),
  statusCode: Joi.number().required(),
});

export default responseSchema;
