const { pool } = require("../config/postgres");

async function getPostgresInfo(req, res) {
  try {
    const version = await pool.query(
      "SELECT version();"
    );

    const connections = await pool.query(
      "SELECT COUNT(*) FROM pg_stat_activity;"
    );

    res.json({
      success: true,
      version: version.rows[0].version,
      activeConnections: Number(
        connections.rows[0].count
      ),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  getPostgresInfo,
};