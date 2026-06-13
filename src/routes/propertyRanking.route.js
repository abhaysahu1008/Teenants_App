const express = require("express");
const AuthMiddleware = require("../middlewares/auth");
const propertyMatchRouter = express.Router();
const propertyRankingController = require("../controllers/propertyRanking.controller");

matchRouter.get(
  "/properties",
  AuthMiddleware,
  propertyRankingController.getBestProperties,
);

module.exports = propertyMatchRouter;
