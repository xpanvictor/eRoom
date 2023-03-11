import Joi from "joi";
import { ChatMessage } from "../../services/chatChannel/chatChannel.type";

export const messageSchema = Joi.object<ChatMessage>({
  timestamp: Joi.date().timestamp().default(Date.now),
  sender: Joi.string().required(),
  channel: Joi.string(),
  message: Joi.string().required(),
});

export const man = 2;
