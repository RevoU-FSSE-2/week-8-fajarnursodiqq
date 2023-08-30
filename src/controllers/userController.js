const db = require("../models/db");
const redisClient = require("../models/redis"); // Mengimpor ioredis

exports.getAllUser = (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while fetching users" });
    } else {
      res.json(result);
    }
  });
};

exports.getUserById = (req, res) => {
  const userId = req.params.id;

  const redisKey = `user:${userId}`;

  redisClient.hgetall(redisKey, (redisErr, cachedData) => {
    if (cachedData && Object.keys(cachedData).length > 0) {
      res.json(cachedData);
      console.log("get data from cache");
    } else {
      const sql =
        "SELECT users.id, name, address, " +
        'SUM(CASE WHEN type="income" THEN amount ELSE 0 END) AS total_income, ' +
        'SUM(CASE WHEN type="expense" THEN amount ELSE 0 END) AS total_expense ' +
        "FROM users " +
        "LEFT JOIN transactions ON users.id = transactions.user_id " +
        "WHERE users.id = ? " +
        "GROUP BY users.id";
      db.query(sql, [userId], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({
            error: "An error occurred while fetching user information",
          });
        } else {
          const userData = {
            id: result[0].id,
            name: result[0].name,
            address: result[0].address,
            balance: result[0].total_income - result[0].total_expense,
            expense: result[0].total_expense,
          };

          // Set data in Redis cache as a hash using HMSET
          redisClient.hmset(redisKey, userData, (hmsetErr, reply) => {
            if (hmsetErr) {
              console.error(hmsetErr);
            } else {
              // Set an expiration time for the hash in Redis (TTL: 1 hour)
              redisClient.expire(redisKey, 3600);
              console.log("add new data to cache");
            }
          });

          res.json(userData);
        }
      });
    }
  });
};
