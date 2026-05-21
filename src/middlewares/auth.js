const { JsonWebTokenError } = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const AuthMiddleware =(req,res,next)=>{

  const cookie = req.cookies;
  const {token} = cookie;

  const decodeToken = await jwt.decode(token);

  const {id} = decodeToken;

  const user = await UserModel.findOne({id});

  req.user = user;
  console.log(user);

  next();
}

module.exports = AuthMiddleware;
