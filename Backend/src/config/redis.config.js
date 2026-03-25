const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (error) {
    console.log("Redis connection error:", error.message);
    process.exit(1);

  }
}
module.exports= {connectRedis,redisClient};
