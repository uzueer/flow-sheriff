const express = require("express");

const router = express.Router();

const { getRedisInfo } = require("../controllers/redisController");

router.get("/redis", getRedisInfo);

module.exports = router;