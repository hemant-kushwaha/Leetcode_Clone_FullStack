const connectDB = require("../config/db.config");
const { connectRedis } = require("../config/redis.config");

const initConnections = async () => {
  await Promise.all([connectRedis(), connectDB()]);
  console.log("All Services Connected SuccessFully");
};

module.exports = initConnections;
