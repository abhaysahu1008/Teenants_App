const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const MessageModel = require("../models/message.model");
const ChatModel = require("../models/chat.model");

const initializeSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie || "";
      const cookieToken = cookieHeader
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      const authToken = socket.handshake.auth?.token;
      const token = authToken || cookieToken;

      if (!token) return next(new Error("Authentication Error"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await UserModel.findById(decoded.id);

      if (!user) return next(new Error("User Not Found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication Error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`${socket.user.name?.firstName || "User"} Connected`);

    // Personal room for notifications
    socket.join(socket.user._id.toString());

    // Fix: Added a callback parameter to prevent race conditions
    socket.on("join-chat", async (chatId, callback) => {
      try {
        const chat = await ChatModel.findById(chatId);
        if (!chat)
          return callback?.({ status: "error", message: "Chat not found" });

        const isParticipant = chat.participants.some(
          (id) => id.toString() === socket.user._id.toString(),
        );
        if (!isParticipant)
          return callback?.({ status: "error", message: "Unauthorized" });

        socket.join(chatId);
        console.log(
          `${socket.user.name?.firstName || "User"} joined room: ${chatId}`,
        );

        // Let the client know it's safe to send messages now
        if (callback) callback({ status: "ok" });
      } catch (err) {
        if (callback)
          callback({ status: "error", message: "Server error joining room" });
      }
    });

    socket.on("leave-chat", (chatId) => {
      socket.leave(chatId);
    });

    socket.on("send-message", async ({ chatId, text }) => {
      try {
        if (!text || !text.trim()) return;

        const chat = await ChatModel.findById(chatId);
        if (!chat) return;

        const message = await MessageModel.create({
          chat: chatId,
          sender: socket.user._id,
          text,
          seenBy: [socket.user._id],
        });

        await ChatModel.findByIdAndUpdate(chatId, { lastMessage: message._id });

        const populatedMessage = await MessageModel.findById(
          message._id,
        ).populate("sender", "name email");

        // Broadcast to everyone in the room
        io.to(chatId).emit("receive-message", populatedMessage);
      } catch (err) {
        console.error("Failed to send message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`${socket.user.name?.firstName || "User"} Disconnected`);
    });
  });
};

module.exports = initializeSocket;
