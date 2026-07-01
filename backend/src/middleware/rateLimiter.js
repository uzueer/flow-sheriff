const { checkRateLimit } = require("../services/tokenBucket");

async function rateLimiter(req, res, next) {
  try {
    const clientId = req.ip;

    const result = await checkRateLimit(clientId);

    res.setHeader("X-RateLimit-Limit", result.capacity);

    res.setHeader(
      "X-RateLimit-Remaining",
      result.remainingTokens
    );

    res.setHeader(
      "Retry-After",
      result.retryAfter
    );

    if (!result.allowed) {
      return res.status(429).json({
        success: false,
        message: "Too Many Requests",
      });
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = rateLimiter;