const PropertyModel = require("../models/property.model");

const getBestProperties = async (req, res) => {
  try {
    const user = req.user;

    const properties = await PropertyModel.find({
      isAvailable: true,

      rent: {
        $gte: user.budget.min,
        $lte: user.budget.max,
      },

      "location.city": user.location.city,

      "roommatePreferences.gender": user.gender,
    });

    const matches = properties.map((property) => {
      let score = 0;

      if (property.roommatePreferences.smoking === user.preferences.smoking) {
        score += 25;
      }

      if (property.roommatePreferences.food === user.preferences.food) {
        score += 25;
      }

      if (
        property.roommatePreferences.sleepTime === user.preferences.sleepTime
      ) {
        score += 20;
      }

      const preferredAmenities = user.preferredAmenities || [];

      const matchingAmenities = property.amenities.filter((amenity) =>
        preferredAmenities.includes(amenity),
      ).length;

      score += matchingAmenities * 5;

      if (score > 90) {
        score = 90;
      }

      return {
        property,
        matchScore: score,
      };
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      results: matches.length,
      data: matches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getBestProperties };
