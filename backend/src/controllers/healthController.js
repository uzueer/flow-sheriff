const { redisClient } = require("../config/redis");
const { pool } = require("../config/postgres");

async function health(req, res) {
  try {
    await redisClient.ping();
    await pool.query("SELECT NOW()");

    res.json({
      success: true,
      redis: "healthy",
      postgres: "healthy",
      uptime: process.uptime(),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = { health };