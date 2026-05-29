const PropertyModel = require("../models/property.model");
const UserModel = require("../models/user.model");
const UserUpdateValidation = require("../utils/validation");

const getCurrentUser = async (req, res) => {
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

const updateUser = async (req, res) => {
  try {
    if (!UserUpdateValidation(req)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Edit Request!",
      });
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) =>
      loggedInUser.set(key, req.body[key]),
    );

    await loggedInUser.save();

    res
      .status(200)
      .json({ data: loggedInUser, message: "User updated successfully!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const viewUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const userFound = await UserModel.findById(userId).select("-password");

    if (!userFound) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User found",
      user: userFound,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUserProperties = async (req, res) => {
  try {
    const UserProperties = await PropertyModel.find({
      createdBy: req.user._id,
    }).populate("createdBy", "name email");

    res.status(200).json({
      message: "User Properties",
      success: true,
      properties: UserProperties,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = { getCurrentUser, updateUser, viewUser, getUserProperties };
