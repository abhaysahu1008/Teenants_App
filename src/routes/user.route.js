const express = require("express");
const userRouter = express.Router();
const userControllers = require("../controllers/user.controller");

userRouter.post("/api/signup", userControllers.userCreateController);
userRouter.post("/api/login", userControllers.userLoginController);
userRouter.post("/api/logout", userControllers.userLogOutController);
userRouter.post("/api/me", userControllers.userProfileController);

module.exports = userRouter;
