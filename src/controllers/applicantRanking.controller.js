const PropertyModel = require("../models/property.model");
const calculateScore = require("../utils/matchScore");

const getApplicantsRank = async (req, res) => {
  const { propertyId } = req.params;
  const property = await PropertyModel.findById(propertyId).populate("tenants");

  const applications = await ApplicationModel.find({
    property: propertyId,
    status: "pending",
  }).populate("applicant");

  const rankedApplicants = applications.map((app) => {
    const score = calculateScore(app.applicant, property.tenants);

    return {
      applicationId: app._id,
      applicant: applications.applicant,
      matchScore: score,
    };
  });

  rankedApplicants.sort((a, b) => b.matchScore - a.matchScore);

  res.status(200).json({ success: true, data: rankedApplicants });
};

module.exports = { getApplicantsRank };
