import Joi from "joi";
import { HttpStatusCode } from "axios";
import { ResponseObject } from "../base.types";

const responseSchema = Joi.object<ResponseObject>({
  message: Joi.string().required(),
  result: Joi.alternatives([Joi.object(), Joi.string()]),
  status: Joi.string(),
  statusCode: Joi.number().default(HttpStatusCode.Ok),
});

export default responseSchema;
