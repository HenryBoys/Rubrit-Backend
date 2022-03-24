import { model, models, Schema, Types } from "mongoose";
import { IMessage } from "./Interfaces";

const messageSchema = new Schema(
  {
    sender: {
      type: Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: Types.ObjectId,
      ref: "Chat",
    },
    readBy: [{ type: Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

export default models.Message || model<IMessage>("Message", messageSchema);
