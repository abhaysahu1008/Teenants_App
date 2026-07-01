const MAX_PREFERENCE_SCORE = 80;

const calculateScore = (applicant, tenants, propertyPreferences = null) => {
  if (!applicant || !applicant.preferences) {
    return 0;
  }

  const comparePreferences = (source, target) => {
    let score = 0;
    if (source.food === target.food) score += 30;
    if (source.smoking === target.smoking) score += 30;
    if (source.sleepTime === target.sleepTime) score += 20;
    return score;
  };

  const normalize = (rawScore) =>
    Math.round(
      (Math.min(rawScore, MAX_PREFERENCE_SCORE) / MAX_PREFERENCE_SCORE) * 100,
    );

  if (!tenants || tenants.length === 0) {
    if (!propertyPreferences) return 0;
    return normalize(
      comparePreferences(applicant.preferences, propertyPreferences),
    );
  }

  let totalScore = 0;

  tenants.forEach((tenant) => {
    totalScore += comparePreferences(applicant.preferences, tenant.preferences);
  });

  return normalize(totalScore / tenants.length);
};

module.exports = calculateScore;
