const express = require("express");
const userRouter = express.Router();
const userControllers = require("../controllers/user.controller");
const AuthMiddleware = require("../middlewares/auth");

userRouter.post("/api/signup", userControllers.userCreateController);
userRouter.post("/api/login", userControllers.userLoginController);
userRouter.post("/api/logout", userControllers.userLogOutController);
userRouter.get(
  "/api/me",
  AuthMiddleware,
  userControllers.userProfileController,
);

module.exports = userRouter;
