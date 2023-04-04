import EventsMonitored, { Listener } from "../../lib/types/socket/events.type";
import { ChatMessage } from "./chatChannel.type";
import { messageSchema } from "../../controllers/schemas/chatChannel.schema";

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
    return console.log("An error occurred", error);
    // todo: proper socket error handling
  }
  // determine sender of the message
  const { user } = modifiedSocket.request;
  // extract message data
  // extract channel data
  const { message, channel } = messagePayload;
  // temporary channel data store
  // perform necessary action for event
  console.log(
    `from: ${user?.user.username}; to channel ${channel}: ${message}`
  );
  if (typeof callBack === "function") {
    // ! sanitize or remove cb, security risk
    callBack();
  }
  // todo: perform actions to message
  // send message back to the socket except user
  modifiedSocket.broadcast.emit(EventsMonitored.userDefined.message, {
    message,
    car: "car_liv",
  });
  // permanently push channel data to mongo store
  return 1;
};

export default handleChat;
