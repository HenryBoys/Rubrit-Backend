import { Types } from "mongoose";

export interface IChat {
  chatName: string;
  isGroupChat: boolean;
  users: Types.ObjectId[];
  latestMessage: Types.ObjectId;
  groupAdmin: Types.ObjectId;
}
