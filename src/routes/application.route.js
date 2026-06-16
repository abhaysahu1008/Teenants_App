const express = require("express");
const AuthMiddleware = require("../middlewares/auth");
const applicationRouter = express.Router();
const ApplicationController = require("../controllers/application.controller");

applicationRouter.post(
  "/:propertyId",
  AuthMiddleware,
  ApplicationController.CreateApplicationController,
);

applicationRouter.get(
  "/me",
  AuthMiddleware,
  ApplicationController.MyApplicationController,
);

applicationRouter.get(
  "/property/:propertyId",
  AuthMiddleware,
  ApplicationController.AllApplicationsController,
);

applicationRouter.get("/:applicationId/match-analysis", AuthMiddleware);

applicationRouter.patch(
  "/:applicationId/accept",
  AuthMiddleware,
  ApplicationController.AcceptApplicationsController,
);

applicationRouter.patch(
  "/:applicationId/reject",
  AuthMiddleware,
  ApplicationController.RejectApplicationsController,
);

applicationRouter.patch(
  "/:applicationId",
  AuthMiddleware,
  ApplicationController.DeleteApplicationsController,
);

module.exports = applicationRouter;
