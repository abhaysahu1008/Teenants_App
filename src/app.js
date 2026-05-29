require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userAuthRoute = require("../src/routes/userAuth.route");
const userRoute = require("../src/routes/user.route");
const propertyRoute = require("../src/routes/property.route");
const applicationRoute = require("../src/routes/application.route");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userAuthRoute);
app.use("/api/users", userRoute);
app.use("/api/properties", propertyRoute);
app.use("/api/applications", applicationRoute);

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
