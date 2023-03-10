import { Listener } from "../../lib/types/socket/events.type";
import { ChatMessage } from "./chatChannel.type";
import { messageSchema } from "../../controllers/schemas/chatChannel.schema";

const handleChat: Listener<Partial<ChatMessage>> = (payload, callBack) => {
  // this means message has entered
  // validate and sanitize the message
  const { error, value } = messageSchema.validate(payload);
  if (error) {
    return console.log("An error occurred", error);
    // todo: proper socket error handling
  }
  console.log("Message received: ", value);
  // determine sender of the message
  // extract message data
  // create message object
  // extract channel data
  // temporary channel data store
  // perform necessary action for event
  if (typeof callBack === "function") {
    // ! sanitize or remove cb, security risk
    callBack();
  }
  // permanently push channel data to mongo store
  return 1;
};

export default handleChat;
