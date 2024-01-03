import SocketClass from "../../config/socket/init";
import { IClass } from "../../services/class/class.type";

export default function chatSocketHandler(socketClass: SocketClass) {
  // First create individual namespaces
  const namespaces: Array<IClass["classId"]> = [];
  socketClass.initiateNamespaces(namespaces);
  // pass auth system to this, etc
}
