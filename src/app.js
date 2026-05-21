require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoute = require("../src/routes/user.route");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", userRoute);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(7000, () => {
      console.log("Server Starteddddd");
    });
  } catch (error) {
    console.log("Something went wrong");
  }
};

startServer();
