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
      sleepTime,
      smoking,
      food,
      longitude,
      latitude,
    } = data;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name: {
        firstName,
        lastName,
      },
      email,
      password: hashPassword,
      budget: {
        min: budgetMin,
        max: budgetMax,
      },
      preferences: {
        sleepTime,
        smoking,
        food,
      },
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
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

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  return user;
};

module.exports = { userCreateService, userLoginService };
