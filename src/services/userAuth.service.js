const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

const userCreateService = async (data) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      budgetMin,
      budgetMax,
      gender,
      sleepTime,
      smoking,
      food,
      longitude,
      latitude,
      city, // ✅ ADDED
      preferredAmenities, // ✅ ADDED (optional)
    } = data;

    // ✅ ADDED validation
    if (budgetMin >= budgetMax) {
      throw new Error("budgetMin must be less than budgetMax");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name: { firstName, lastName },
      email,
      password: hashPassword,
      budget: { min: budgetMin, max: budgetMax },
      gender,
      preferences: { sleepTime, smoking, food },
      preferredAmenities: preferredAmenities || [], // ✅ ADDED
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
        city, // ✅ ADDED
      },
    });

    return user;
  } catch (error) {
    throw error;
  }
};

const userLoginService = async (data) => {
  const { email, password } = data;
  const user = await UserModel.findOne({ email });
  console.log(user);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }
  console.log(validPassword);

  return user;
};

module.exports = { userCreateService, userLoginService };
