import SocketClass from "../../config/socket/init";
import EventsMonitored from "../types/socket/events.type";
import handleChat from "../../services/chatChannel/chatChannel.controller";

export default function createChatChannel(socketClass: SocketClass) {
  // first we handle connection; todo: should be another controller; auth and co
  socketClass.attachListener(
    EventsMonitored.socketEvents.connection,
    (socket) => {
      console.log("A user attached");
      // routing: for all user events occurring
      socket?.attachListener(EventsMonitored.userDefined.message, handleChat);
    }
  );
  // lastly handle user disconnection
  socketClass.attachListener(EventsMonitored.socketEvents.disconnect, () => {
    console.log("User disconnected");
  });
}
