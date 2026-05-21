const UserModel = require("../models/user.model");
const UserServices = require("../services/user.service");

const userCreateController = async (req, res) => {
  try {
    const userData = await UserServices.userCreateService(req.body);

    res.status(201).json({
      success: true,
      message: "User created Successfully",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const userLoginController = async (req, res) => {
  try {
    const user = await UserServices.userLoginService(req.body);
    const token = user.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: { user, token },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const userLogOutController = async (req, res) => {
  try {
    const cookie = req.cookies;

    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });

    res.send("User logged out succesfully");
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const userProfileController = async (req, res) => {
  try {
    const { user } = req;

    const userProfile = await UserModel.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      data: userProfile,
      message: "User data fetched",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  userCreateController,
  userLoginController,
  userLogOutController,
  userProfileController,
};
