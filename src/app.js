require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userAuthRoute = require("./routes/userAuth.route");
const userRoute = require("./routes/user.route");
const propertyRoute = require("./routes/property.route");
const applicationRoute = require("./routes/application.route");
const propertyRankingRoute = require("./routes/propertyRanking.route");
const applicantRankingRoute = require("./routes/applicantRanking.route");

const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userAuthRoute);
app.use("/api/users", userRoute);
app.use("/api/properties", propertyRoute);
app.use("/api/applications", applicationRoute);
app.use("/api/matches", propertyRankingRoute);
app.use("/api/matches", applicantRankingRoute);

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
