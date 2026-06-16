const express = require("express");
const AuthMiddleware = require("../middlewares/auth");
const aiRouter = express.Router();
const AiMatchController = require("../controllers/aiAnalysis.controller");

aiRouter.get(
  "/:applicationId/match-analysis",
  AuthMiddleware,
  AiMatchController.MatchAnalysisController,
);

module.exports = aiRouter;
