const express = require("express");
const AuthMiddleware = require("../middlewares/auth");
const chatController = require("../controllers/chat.controller");

const chatRoute = express.Router();

chatRoute.post(
  "/:receiverId",
  AuthMiddleware,
  chatController.createChatController,
);

chatRoute.get("/", AuthMiddleware, chatController.getAllChatsController);

chatRoute.get(
  "/:chatId/messages",
  AuthMiddleware,
  chatController.getMessagesController,
);

module.exports = chatRoute;
