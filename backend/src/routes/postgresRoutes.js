const express = require("express");

const router = express.Router();

const {
  getPostgresInfo,
} = require("../controllers/postgresController");

router.get("/postgres", getPostgresInfo);

module.exports = router;