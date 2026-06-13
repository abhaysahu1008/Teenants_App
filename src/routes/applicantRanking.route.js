const express = require("express");
const AuthMiddleware = require("../middlewares/auth");

const applicantRankRouter = express.Router();
const applicantRankController = require("../controllers/applicantRanking.controller");

applicantRankRouter.get(
  "/",
  AuthMiddleware,
  applicantRankController.getApplicantsRank,
);
