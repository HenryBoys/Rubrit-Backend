//from modules
import { model, models, Schema, Types } from "mongoose";
import { IChat } from "./Interfaces";

const chatSchema = new Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default models.Chat || model<IChat>("Chat", chatSchema);
