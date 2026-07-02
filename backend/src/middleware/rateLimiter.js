const { checkRateLimit } = require("../services/tokenBucket");
const { logRequest } = require("../services/logService");

const SERVER_IDS = (process.env.SERVER_IDS || "API-1,API-2,API-3")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

let serverIndex = 0;

function getNextServerId() {
  const serverId = SERVER_IDS[serverIndex % SERVER_IDS.length] || "API-1";
  serverIndex = (serverIndex + 1) % SERVER_IDS.length;
  return serverId;
}

async function rateLimiter(req, res, next) {
  const start = Date.now();

  try {
    const clientId = req.ip || "unknown";
    const result = await checkRateLimit(clientId);
    const serverId = getNextServerId();

    req.rateLimitResult = result;
    req.serverId = serverId;

    res.setHeader("X-RateLimit-Limit", result.capacity);
    res.setHeader("X-RateLimit-Remaining", result.remainingTokens);
    res.setHeader("Retry-After", result.retryAfter);
    res.setHeader("X-Server-Id", serverId);

    const responseTime = Date.now() - start;
    const statusCode = result.allowed ? 200 : 429;

    await logRequest({
      clientIp: clientId,
      endpoint: req.originalUrl || "/api/test",
      method: req.method,
      statusCode,
      remainingTokens: result.remainingTokens,
      responseTime,
    });

    if (!result.allowed) {
      return res.status(429).json({
        success: false,
        message: "Too Many Requests",
        remainingTokens: result.remainingTokens,
        retryAfter: result.retryAfter,
        serverId,
      });
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = rateLimiter;