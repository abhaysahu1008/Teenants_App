const express = require("express");
const userRouter = express.Router();
const userControllers = require("../controllers/user.controller");
const AuthMiddleware = require("../middlewares/auth");

userRouter.get("/me", AuthMiddleware, userControllers.getCurrentUser);
userRouter.patch("/me", AuthMiddleware, userControllers.updateUser);
// userRouter.delete("/me", AuthMiddleware);

userRouter.get("/:userId", AuthMiddleware, userControllers.viewUser);
userRouter.get(
  "/:userId/properties",
  AuthMiddleware,
  userControllers.getUserProperties,
);
userRouter.get(
  "/:userId/applications",
  AuthMiddleware,
  userControllers.getUserApplication,
);
module.exports = userRouter;
