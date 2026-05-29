const express = require("express");
const AuthMiddleware = require("../middlewares/auth");
const applicationRouter = express.Router();
const ApplicationController = require("../controllers/application.controller");

applicationRouter.post(
  "/:propertyId",
  AuthMiddleware,
  ApplicationController.CreateApplicationController,
);

module.exports = applicationRouter;
