const { pool } = require("../config/postgres");

async function logRequest({
  clientIp,
  endpoint,
  method,
  statusCode,
  remainingTokens,
  responseTime,
}) {
  const query = `
        INSERT INTO request_logs
        (
            client_ip,
            endpoint,
            method,
            status_code,
            remaining_tokens,
            response_time_ms
        )
        VALUES ($1,$2,$3,$4,$5,$6)
    `;

  const values = [
    clientIp,
    endpoint,
    method,
    statusCode,
    remainingTokens,
    responseTime,
  ];

  await pool.query(query, values);
}

module.exports = {
  logRequest,
};