import SocketClass from "../../config/socket/init";
import EventsMonitored, { ModifiedSocket } from "../types/socket/events.type";
import handleChat from "../../services/chatChannel/chatChannel.controller";
import ProgrammingError from "../../error/technical/ProgrammingError";
import { ChatMessage } from "../../services/chatChannel/chatChannel.type";
import attachRoomsMiddleware from "../../middlewares/socket/attachRooms.middleware";
import logger from "../../utils/logger";

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
      const userService = modifiedSocket.request.user;
      logger.info("A user attached", userService.user.username);

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
    logger.info("User disconnected");
  });
}
