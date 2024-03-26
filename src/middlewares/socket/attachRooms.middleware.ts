import { Listener } from "../../lib/types/socket/events.type";
import UserService from "../../services/user/user.service";
import logger from "../../utils/logger";

const attachRoomsMiddleware: Listener<UserService> = (
  userService,
  modifiedSocket
) => {
  const channelsBelonged = userService.user.chatChannels;
  logger.info(channelsBelonged);
  modifiedSocket.join(channelsBelonged);
};

export default attachRoomsMiddleware;
