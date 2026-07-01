const { redisClient } = require("../config/redis");

async function getRedisInfo(req, res) {
  try {
    const info = await redisClient.info();

    const keys = await redisClient.dbSize();

    res.json({
      success: true,
      totalKeys: keys,
      info,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  getRedisInfo,
};