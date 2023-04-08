import { Listener } from "../../lib/types/socket/events.type";
import UserService from "../../services/user/user.service";

const attachRoomsMiddleware: Listener<UserService> = (
  userService,
  modifiedSocket
) => {
  const channelsBelonged = userService.user.chatChannels;
  console.log(channelsBelonged);
  modifiedSocket.join(channelsBelonged);
};

export default attachRoomsMiddleware;
