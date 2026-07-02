const { pool } = require("../config/postgres");

async function getStats(req, res) {
  try {
    const totalRequests = await pool.query(
      "SELECT COUNT(*) FROM request_logs"
    );

    const blockedRequests = await pool.query(
      "SELECT COUNT(*) FROM request_logs WHERE status_code = 429"
    );

    const allowedRequests = await pool.query(
      "SELECT COUNT(*) FROM request_logs WHERE status_code = 200"
    );

    const activeClients = await pool.query(
      "SELECT COUNT(DISTINCT client_ip) FROM request_logs"
    );

    const avgLatency = await pool.query(
      "SELECT ROUND(AVG(response_time_ms),2) AS avg FROM request_logs"
    );

    res.json({
      success: true,
      data: {
        totalRequests: Number(totalRequests.rows[0].count),
        allowedRequests: Number(allowedRequests.rows[0].count),
        blockedRequests: Number(blockedRequests.rows[0].count),
        activeClients: Number(activeClients.rows[0].count),
        averageLatency: Number(avgLatency.rows[0].avg || 0),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function getLogs(req, res) {
  try {
    const result = await pool.query(`
      SELECT id, endpoint, method, status_code AS status, response_time_ms, remaining_tokens, client_ip, created_at
      FROM request_logs
      ORDER BY created_at DESC
      LIMIT 50
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  getStats,
  getLogs,
};