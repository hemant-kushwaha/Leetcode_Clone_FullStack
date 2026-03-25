const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { redisClient } = require("../config/redis.config");

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) throw new Error("No token provided");

    //verify token
    const payload = jwt.verify(token,process.env.JWT_SECRET_KEY);

    const { _id } = payload;
    if (!_id) {
      throw new Error("ID is Missing");
    }

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User Doesn't Exists ");
    }
    req.user = user;

    //Redis Blacklist Check
    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) {
      throw new Error("Token Blocked");
    }

    console.log("User Authenticated Successfully");
    next();
  } catch (error) {
    res.status(401).send({
      //Unauthorized Access
      success: false,
      message: error.message,
    });
  }
};

module.exports=authMiddleware;