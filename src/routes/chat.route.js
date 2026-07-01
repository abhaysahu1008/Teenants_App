const express = require("express");
const AuthMiddleware = require("../middlewares/auth");
const ChatController = require("../controllers/chat.controller");

const chatRouter = express.Router();

chatRouter.get(
  "/conversations",
  AuthMiddleware,
  ChatController.getConversationsController,
);
chatRouter.get(
  "/messages/:chatUserId",
  AuthMiddleware,
  ChatController.getMessagesController,
);

module.exports = chatRouter;
