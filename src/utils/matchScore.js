const calculateScore = (applicant, tenants) => {
  let totalScore = 0;

  if (tenants.length === 0) {
    return 50;
  }

  tenants.forEach((tenant) => {
    let score = 0;

    if (tenant.preferences.food === applicant.preferences.food) {
      score += 40;
    }

    if (tenant.preferences.smoking === applicant.preferences.smoking) {
      score += 30;
    }

    if (tenant.preferences.sleepTime === applicant.preferences.sleepTime) {
      score += 30;
    }

    totalScore += score;
  });

  return Math.round(totalScore / tenants.length);
};

module.exports = calculateScore;
