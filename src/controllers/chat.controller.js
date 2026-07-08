const ChatModel = require("../models/chat.model");
const UserModel = require("../models/user.model");
const MessageModel = require("../models/message.model");

const createChatController = async (req, res) => {
  try {
    const { receiverId } = req.params;

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot create a chat with yourself.",
      });
    }

    const existingChat = await ChatModel.findOne({
      participants: {
        $all: [req.user._id, receiverId],
      },
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const receiver = await UserModel.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    const newChat = await ChatModel.create({
      participants: [req.user._id, receiverId],
    });

    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllChatsController = async (req, res) => {
  try {
    const chats = await ChatModel.find({
      participants: req.user._id,
    })
      .populate("participants", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMessagesController = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await ChatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const isParticipant = chat.participants.some(
      (participant) => participant.toString() === req.user._id.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const messages = await MessageModel.find({
      chat: chatId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createChatController,
  getAllChatsController,
  getMessagesController,
};
