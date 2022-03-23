import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Chat from "../models/Chat";
import User from "../models/User";
import Message from "../models/Message";

export const allMessages = asyncHandler(async (req: Request, res: Response) => {
  try {
    const queryPopulate = [
      { path: "sender", model: "User", select: "_id name profilePic email" },
      { path: "chat", model: "Chat" },
    ];
    const messages = await Message.find({ chat: req.params.chatId }).populate(
      queryPopulate
    );
    // .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const sendMessage = asyncHandler(async (req: any, res: any) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate({
      path: "sender",
      model: "User",
      select: "_id name profilePic",
    });
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "_id name profilePic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
