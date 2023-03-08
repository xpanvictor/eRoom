import { Listener } from "../../lib/types/socket/events.type";

const handleChat: Listener<any> = () => {
  // this means message has entered
  // validate and serialize the message
  // determine sender of the message
  // extract message data
  // create message object
  // extract channel data
  // temporary channel data store
  // permanently push channel data to mongo store
};

export default handleChat;
