const express = require("express");

const router = express.Router();

const rateLimiter = require("../middleware/rateLimiter");

router.get("/test", rateLimiter, (req, res) => {
  res.json({
    success: true,
    message: "Request Allowed 🚀",
    remainingTokens: req.rateLimitResult?.remainingTokens ?? 0,
    retryAfter: req.rateLimitResult?.retryAfter ?? 0,
    serverId: req.serverId || "API-1",
  });
});

module.exports = router;