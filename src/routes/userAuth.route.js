const express = require("express");
const userAuthRouter = express.Router();
const userAuthControllers = require("../controllers/userAuth.controller");
const AuthMiddleware = require("../middlewares/auth");

userAuthRouter.post("/signup", userAuthControllers.userCreateController);
userAuthRouter.post("/login", userAuthControllers.userLoginController);
userAuthRouter.post("/logout", userAuthControllers.userLogOutController);

module.exports = userAuthRouter;
