const express = require("express");

const router = express.Router();

const rateLimiter = require("../middleware/rateLimiter");

router.get("/test", rateLimiter, (req, res) => {
  res.json({
    success: true,
    message: "Request Allowed 🚀",
  });
});

module.exports = router;