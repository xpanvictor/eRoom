import SocketClass from "../../config/socket/init";
import EventsMonitored, { ModifiedSocket } from "../types/socket/events.type";
import handleChat from "../../services/chatChannel/chatChannel.controller";
import ProgrammingError from "../../error/technical/ProgrammingError";
import { ChatMessage } from "../../services/chatChannel/chatChannel.type";
import attachRoomsMiddleware from "../../middlewares/socket/attachRooms.middleware";
import { IClass } from "../../services/class/class.type";

export default function createChatChannel(socketClass: SocketClass) {
  // Should break down into the categories of namespaces here
  const namespaces: Array<IClass["classId"]> = [];
  socketClass.initiateNamespaces(namespaces);
  // first we handle connection
  socketClass.attachListener(
    EventsMonitored.socketEvents.connection,
    (socket) => {
      const modifiedSocket = socket?.elemSocket as unknown as ModifiedSocket;
      if (!modifiedSocket?.request?.user) {
        throw new ProgrammingError("User not identified");
      }
      // log a user intro
      const userService = modifiedSocket.request.user;
      console.log("A user attached", userService.user.username);

      // mount listener for all channels user belongs to
      attachRoomsMiddleware(userService, modifiedSocket);

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
