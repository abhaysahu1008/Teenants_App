const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const AuthMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserModel.findById(decodedToken.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    console.log("USER", user);

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = AuthMiddleware;
