import EventsMonitored, { Listener } from "../../lib/types/socket/events.type";
import { ChatMessage } from "./chatChannel.type";
import { messageSchema } from "../../controllers/schemas/chatChannel.schema";
import logger from "../../utils/logger";

const handleChat: Listener<Partial<ChatMessage>> = (
  payload,
  modifiedSocket,
  callBack
) => {
  // validate and sanitize the message
  const { error, value: messagePayload } = messageSchema.validate(payload);
  if (error) {
    // map error object
    modifiedSocket.emit(EventsMonitored.userDefined.error, {
      err: error.message,
    });
    return logger.error(error);
    // todo: proper socket error handling
  }
  // determine sender of the message
  const { user } = modifiedSocket.request;
  // extract message data
  // extract channel data
  const { message, channel } = messagePayload;
  const { channelId } = modifiedSocket;
  if (!channelId) {
    return modifiedSocket.emit(EventsMonitored.userDefined.error, {
      err: "No channel Id provided.",
    });
  }
  // temporary channel data store
  // perform necessary action for event
  logger.info(
    `from: ${user?.user.username}; to channel ${channel}-${channelId}: ${message}`
  );
  if (typeof callBack === "function") {
    // ! sanitize or remove cb, security risk
    callBack();
  }
  // use rooms instead to broadcast message
  // send message back to the socket except user
  modifiedSocket.broadcast
    .to(channelId)
    .emit(EventsMonitored.userDefined.message, {
      message,
      car: "car_liv",
    });
  // permanently push channel data to mongo store
  return 1;
};

export default handleChat;
