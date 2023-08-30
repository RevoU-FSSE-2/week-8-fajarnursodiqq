const redis = require("ioredis");

const redisClient = new redis({
  host: "containers-us-west-99.railway.app",
  port: "7501",
  password: "NgNc2qs0GORi0pHpv4J3",
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

module.exports = redisClient;
