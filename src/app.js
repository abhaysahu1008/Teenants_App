require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const userAuthRoute = require("./routes/userAuth.route");
const userRoute = require("./routes/user.route");
const propertyRoute = require("./routes/property.route");
const applicationRoute = require("./routes/application.route");
const propertyRankingRoute = require("./routes/propertyRanking.route");
const applicantRankingRoute = require("./routes/applicantRanking.route");
const aiAnalysisRoute = require("./routes/aiAnalysis.route");
const chatRoute = require("./routes/chat.route");
const { default: mongoose } = require("mongoose");
const { Server } = require("socket.io");
const initializeSocket = require("./sockets/chatSocket");

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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
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
    credentials: true,
    methods: ["GET", "POST"],
  },
});

initializeSocket(io);

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
