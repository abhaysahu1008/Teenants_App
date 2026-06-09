const express = require("express");
const propertyController = require("../controllers/property.controller");
const AuthMiddleware = require("../middlewares/auth");
const propertyRouter = express.Router();

propertyRouter.post(
  "/create",
  AuthMiddleware,
  propertyController.propertyCreateController,
);

propertyRouter.get(
  "/search",
  AuthMiddleware,
  propertyController.searchPropertyController,
);

propertyRouter.get(
  "/nearby",
  AuthMiddleware,
  propertyController.nearbyPropertyController,
);

propertyRouter.get(
  "/:propertyId",
  AuthMiddleware,
  propertyController.propertyViewController,
);

module.exports = propertyRouter;
