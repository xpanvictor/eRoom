import SocketClass from "../../config/socket/init";
import EventsMonitored, { ModifiedSocket } from "../types/socket/events.type";
import handleChat from "../../services/chatChannel/chatChannel.controller";
import ProgrammingError from "../../error/technical/ProgrammingError";
import { ChatMessage } from "../../services/chatChannel/chatChannel.type";

export default function createChatChannel(socketClass: SocketClass) {
  // first we handle connection
  socketClass.attachListener(
    EventsMonitored.socketEvents.connection,
    (socket) => {
      const modifiedSocket = socket?.elemSocket as unknown as ModifiedSocket;
      if (!modifiedSocket?.request?.user) {
        throw new ProgrammingError("User not identified");
      }
      // log a user intro
      console.log(
        "A user attached",
        modifiedSocket?.request?.user?.user.username
      );

      // todo: mount listener for all channels user belong to

      // routing: for all user events occurring
      socket?.attachListener<Partial<ChatMessage>>(
        EventsMonitored.userDefined.message,
        handleChat
      );
    }
  );
  // lastly handle user disconnection
  socketClass.attachListener(EventsMonitored.socketEvents.disconnect, () => {
    console.log("User disconnected");
  });
}
