require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const userAuthRoute = require("./routes/userAuth.route");
const userRoute = require("./routes/user.route");
const propertyRoute = require("./routes/property.route");
const applicationRoute = require("./routes/application.route");
const propertyRankingRoute = require("./routes/propertyRanking.route");
const applicantRankingRoute = require("./routes/applicantRanking.route");
const aiAnalysisRoute = require("./routes/aiAnalysis.route");
const chatRoute = require("./routes/chat.route");
const ChatMessageModel = require("./models/chat.model");

const app = express();

app.use(
  cors({
    origin: [
      "https://tenants-frontend.netlify.app",
      "http://localhost:5173",
      "https://teenants.site",
      "https://www.teenants.site",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "https://tenants-frontend.netlify.app",
      "http://localhost:5173",
      "https://teenants.site",
      "https://www.teenants.site",
    ],
    methods: ["GET", "POST"],
  },
});

const connectedUsers = new Map();

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error"));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    socket.userId = payload.id;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.userId);
  connectedUsers.set(socket.userId, socket.id);
  socket.join(`user:${socket.userId}`);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
    connectedUsers.delete(socket.userId);
  });

  // FIX: When user starts chatting with someone, join the chat room
  socket.on("join_chat", ({ otherUserId }) => {
    if (!otherUserId) return;
    const roomId = `chat:${[socket.userId.toString(), otherUserId.toString()].sort().join(":")}`;
    socket.join(roomId);
    console.log(`User ${socket.userId} joined room ${roomId}`);
  });

  socket.on("leave_chat", ({ otherUserId }) => {
    if (!otherUserId) return;
    const roomId = `chat:${[socket.userId.toString(), otherUserId.toString()].sort().join(":")}`;
    socket.leave(roomId);
  });

  socket.on("send_message", async ({ receiverId, text }) => {
    if (!receiverId || !text) return;

    if (receiverId.toString() === socket.userId.toString()) {
      return socket.emit("message_error", {
        message: "Cannot message yourself",
      });
    }

    try {
      const message = await ChatMessageModel.create({
        sender: socket.userId,
        receiver: receiverId,
        text,
      });

      await message.populate("sender", "name email");
      await message.populate("receiver", "name email");

      const payload = {
        _id: message._id,
        sender: message.sender,
        receiver: message.receiver,
        text: message.text,
        read: message.read,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      };

      // Create room and add both users
      const roomId = `chat:${[socket.userId.toString(), receiverId.toString()].sort().join(":")}`;

      // Emit to the chat room (both sender and receiver if they're in it)
      io.to(roomId).emit("receive_message", payload);

      // Also emit to receiver's personal room as fallback
      io.to(`user:${receiverId.toString()}`).emit("receive_message", payload);

      // Confirm to sender
      socket.emit("message_sent", payload);
    } catch (error) {
      console.error("Socket send_message error:", error);
      socket.emit("message_error", { message: error.message });
    }
  });
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userAuthRoute);
app.use("/api/users", userRoute);
app.use("/api/properties", propertyRoute);
app.use("/api/applications", applicationRoute);
app.use("/api/matches/properties", propertyRankingRoute);
app.use("/api/matches/applicants", applicantRankingRoute);
app.use("/api/matches/applications", aiAnalysisRoute);
app.use("/api/chat", chatRoute);

const PORT = process.env.PORT || 7000;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server started successfully on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
