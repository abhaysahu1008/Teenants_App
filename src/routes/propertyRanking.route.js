const express = require("express");
const AuthMiddleware = require("../middlewares/auth");
const propertyRankingRouter = express.Router();
const propertyRankingController = require("../controllers/propertyRanking.controller");

propertyRankingRouter.get(
  "/propertyRanking",
  AuthMiddleware,
  propertyRankingController.getBestProperties,
);

module.exports = propertyRankingRouter;
