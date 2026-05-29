const UserUpdateValidation = (req) => {
  const AllowedUpdates = [
    "name.firstName",
    "name.lastName",
    "budget.max",
    "budget.min",
    "gender",
    "preferences.food",
    "preferences.sleepTime",
    "preferences.smoking",
    "location.coordinates",
  ];

  const isEditedAllowed = Object.keys(req.body).every((field) => {
    return AllowedUpdates.includes(field);
  });

  return isEditedAllowed;
};

module.exports = UserUpdateValidation;
