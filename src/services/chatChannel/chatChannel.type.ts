import { Model, Types } from "mongoose";
import IUser from "../user/user.type";

export enum ChatChannelTypes {
  Class = "class",
  Personal = "personal",
}

export interface ChatMessage {
  timestamp: Date;
  sender: Pick<IUser, "id">;
  channel: Pick<IChatChannel, "id">;
  // the message sent
  message: string;
}

export interface IChatChannel {
  // id of the channel, NN and unique
  id: Types.ObjectId;
  // chat channel code, esp not personal
  code: string;
  // name of the channel, not necessary
  name: string;
  // type of chat channel
  chatChannelType: ChatChannelTypes;
  // define the members of the channel
  members: Types.Array<IUser>;
  // the chat history
  chatHistory: Types.Array<ChatMessage>;
  // the users who are in the approval queue
  joinQueue: Types.Array<IUser>;
}

export interface IChatChannelMethods {
  print: () => string;
}

export type ChatChannelModel = Model<IChatChannel, object, IChatChannelMethods>;
