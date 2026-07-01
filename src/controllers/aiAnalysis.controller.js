const ApplicationModel = require("../models/application.model");
const analyzeRoommateCompatibility = require("../utils/aiMatchAnalysis");
const calculateScore = require("../utils/matchScore");

const MatchAnalysisController = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await ApplicationModel.findById(applicationId)
      .populate("applicant")
      .populate({
        path: "property",
        populate: {
          path: "tenants",
        },
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const applicant = application.applicant;
    const tenants = application.property.tenants;
    const refresh = req.query.refresh === "true";

    const ruleScore = calculateScore(
      applicant,
      tenants,
      application.property.roommatePreferences,
    );
    const tenantsBios = tenants.map((tenant) => tenant.bio || "");

    let aiAnalysis = application.aiAnalysis;
    let cached = false;

    if (!refresh && aiAnalysis && typeof aiAnalysis.score === "number") {
      cached = true;
    } else {
      const AiMatchAnalysisScore = await analyzeRoommateCompatibility(
        applicant.bio || "",
        tenantsBios,
      );

      aiAnalysis = {
        score: AiMatchAnalysisScore.score,
        pros: AiMatchAnalysisScore.pros,
        conflicts: AiMatchAnalysisScore.conflicts,
        summary: AiMatchAnalysisScore.summary,
        analyzedAt: new Date(),
      };

      application.aiAnalysis = aiAnalysis;
      await application.save();
    }

    const finalScore = Math.round(ruleScore * 0.7 + aiAnalysis.score * 0.3);

    return res.status(200).json({
      success: true,
      data: {
        applicantId: applicant._id,
        ruleScore,
        aiScore: aiAnalysis.score,
        finalScore,
        pros: aiAnalysis.pros,
        conflicts: aiAnalysis.conflicts,
        summary: aiAnalysis.summary,
        analyzedAt: aiAnalysis.analyzedAt,
        cached,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  MatchAnalysisController,
};
