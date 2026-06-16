const calculateScore = (applicant, tenants) => {
  if (tenants.length === 0) {
    return 100;
  }

  let totalScore = 0;

  tenants.forEach((tenant) => {
    let score = 0;

    if (tenant.preferences.food === applicant.preferences.food) {
      score += 30;
    }

    if (tenant.preferences.smoking === applicant.preferences.smoking) {
      score += 30;
    }

    if (tenant.preferences.sleepTime === applicant.preferences.sleepTime) {
      score += 20;
    }

    totalScore += score;
  });

  return Math.round(totalScore / tenants.length);
};

module.exports = calculateScore;
