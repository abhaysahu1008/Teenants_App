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

    const ruleScore = calculateScore(applicant, tenants);

    const tenantsBios = tenants.map((tenant) => tenant.bio || "");

    const AiMatchAnalysisScore = await analyzeRoommateCompatibility(
      applicant.bio || "",
      tenantsBios,
    );

    const finalScore = Math.round(
      ruleScore * 0.7 + AiMatchAnalysisScore.score * 0.3,
    );

    return res.status(200).json({
      success: true,
      data: {
        applicantId: applicant._id,
        ruleScore,
        aiScore: AiMatchAnalysisScore.score,
        finalScore,
        pros: AiMatchAnalysisScore.pros,
        conflicts: AiMatchAnalysisScore.conflicts,
        summary: AiMatchAnalysisScore.summary,
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
