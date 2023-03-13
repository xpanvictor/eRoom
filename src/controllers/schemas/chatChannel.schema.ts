import Joi from "joi";
import { ChatMessage } from "../../services/chatChannel/chatChannel.type";

export const messageSchema = Joi.object<ChatMessage>({
  timestamp: Joi.date().timestamp().default(Date.now),
  sender: Joi.string(),
  channel: Joi.string().required(),
  message: Joi.string().required(),
});

export const man = 2;
