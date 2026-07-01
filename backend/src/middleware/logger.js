const { logRequest } = require("../services/logService");

async function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", async () => {
    try {
      const responseTime = Date.now() - start;

      await logRequest({
        clientIp: req.ip,
        endpoint: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        remainingTokens: Number(
          res.getHeader("X-RateLimit-Remaining") || 0
        ),
        responseTime,
      });
    } catch (err) {
      console.error("Logger Error:", err.message);
    }
  });

  next();
}

module.exports = logger;