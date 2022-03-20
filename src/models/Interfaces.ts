import { Types } from "mongoose";

export interface IChat {
  chatName: string;
  isGroupChat: boolean;
  users: Types.ObjectId[];
  latestMessage: Types.ObjectId;
  groupAdmin: Types.ObjectId;
}

export interface IMessage {
  sender: Types.ObjectId;
  content: string;
  chat: Types.ObjectId;
}
