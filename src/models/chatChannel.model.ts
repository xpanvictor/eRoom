import mongoose from "mongoose";
import {
  ChatChannelModel,
  ChatChannelTypes,
  IChatChannel,
  IChatChannelMethods,
} from "../services/chatChannel/chatChannel.type";

/**
 * We can use an archive system for chat history
 * Basically store chat temporarily
 * Once past limit, we move to text file
 * Add a decoder to fetch old chats from
 * channel id and timestamp as file name
 * */

const ChatChannelSchema = new mongoose.Schema<
  IChatChannel,
  ChatChannelModel,
  IChatChannelMethods
>(
  {
    name: {
      type: String,
      default: "Anonymous",
    },
    code: {
      type: String,
      unique: true,
      slug: "name",
    },
    chatChannelType: {
      type: String,
      enum: ChatChannelTypes,
      required: [true, "Chat channel type not defined!"],
    },
    joinQueue: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    chatHistory: [
      {
        type: {
          timestamp: {
            type: Date,
            default: Date.now(),
          },
          sender: {
            type: mongoose.Types.ObjectId,
            ref: "User",
          },
          // this field may not be necessary if we can guarantee one way data structure
          channel: {
            type: mongoose.Types.ObjectId,
            ref: "ChatChannel",
            default: (this as unknown as IChatChannel).id,
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ChatChannel", ChatChannelSchema);
