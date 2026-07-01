const PropertyModel = require("../models/property.model");
const calculateScore = require("../utils/matchScore");
const ApplicationModel = require("../models/application.model");

const getApplicantsRank = async (req, res) => {
  const { propertyId } = req.params;
  const property = await PropertyModel.findById(propertyId).populate("tenants");

  if (!property) {
    return res.status(404).json({
      success: false,
      message: "Property not found",
    });
  }

  const applications = await ApplicationModel.find({
    property: propertyId,
  }).populate("applicant");

  const rankedApplicants = applications.map((app) => {
    const score = calculateScore(
      app.applicant,
      property.tenants,
      property.roommatePreferences,
    );

    const aiScore = app.aiAnalysis?.score;
    const finalScore =
      typeof aiScore === "number"
        ? Math.round(score * 0.7 + aiScore * 0.3)
        : score;

    return {
      applicationId: app._id,
      applicant: app.applicant,
      status: app.status,
      message: app.message,
      createdAt: app.createdAt,
      matchScore: score,
      aiScore: typeof aiScore === "number" ? aiScore : null,
      finalScore,
    };
  });

  rankedApplicants.sort((a, b) => b.finalScore - a.finalScore);

  res.status(200).json({ success: true, data: rankedApplicants });
};

module.exports = { getApplicantsRank };
