import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Chat from "../models/Chat";
import User from "../models/User";

export const accessChat = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    // res.status(400);
    res.status(400);
    throw new Error("UserId param not sent with request");
  }
  const queryPopulate = [
    { path: "users", model: "User", select: "_id name email profilePic" },
    { path: "latestMessage", model: "Message" },
  ];
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  }).populate(queryPopulate);

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

export const fetchChats = asyncHandler(async (req: Request, res: Response) => {
  try {
    const queryPopulate = [
      { path: "users", model: "User", select: "_id name email profilePic" },
      {
        path: "groupAdmin",
        model: "User",
        select: "_id name email profilePic",
      },
      { path: "latestMessage", model: "Message" },
    ];

    let resp = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate(queryPopulate)
      // .populate("groupAdmin", "-password")
      // .populate("users", "-password")
      // .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const results = await User.populate(resp, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).send(results);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const createGroupChat = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.body.users || !req.body.name) {
      // return res.status(400).send({ message: "Please Fill all the fields" });
      res.status(400);
      throw new Error("Please Fill all the fields");
    }

    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
      // return res.status(400).send("More than 2 users are required to form a group chat");
      res.status(400);
      throw new Error("More than 2 users are required to form a group chat");
    }
    users.push(req.user);

    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });

      const queryPopulate = [
        { path: "users", model: "User", select: "_id name email profilePic" },
        {
          path: "groupAdmin",
          model: "User",
          select: "_id name email profilePic",
        },
      ];
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate(
        queryPopulate
      );
      // .populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
);

export const renameGroup = asyncHandler(async (req: Request, res: Response) => {
  const { chatId, chatName } = req.body;
  const queryPopulate = [
    { path: "users", model: "User", select: "_id name email profilePic" },
    {
      path: "groupAdmin",
      model: "User",
      select: "_id name email profilePic",
    },
  ];
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  ).populate(queryPopulate);
  // .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

export const addToGroup = asyncHandler(async (req: Request, res: Response) => {
  const { chatId, userId } = req.body;
  const queryPopulate = [
    { path: "users", model: "User", select: "_id name email profilePic" },
    {
      path: "groupAdmin",
      model: "User",
      select: "_id name email profilePic",
    },
  ];
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  ).populate(queryPopulate);
  // .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

export const removeFromGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin
    const queryPopulate = [
      { path: "users", model: "User", select: "_id name email profilePic" },
      {
        path: "groupAdmin",
        model: "User",
        select: "_id name email profilePic",
      },
    ];
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    ).populate(queryPopulate);
    // .populate("groupAdmin", "-password");

    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
  }
);
