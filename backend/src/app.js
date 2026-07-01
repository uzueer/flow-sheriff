const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const analyticsRoutes = require("./routes/analyticsRoutes");
const apiRoutes = require("./routes/apiRoutes");
const logger = require("./middleware/logger");
const healthRoutes = require("./routes/healthRoutes");
const redisRoutes = require("./routes/redisRoutes");
const postgresRoutes = require("./routes/postgresRoutes");




const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Logger should come BEFORE routes
app.use(logger);

// Routes
app.use("/api", analyticsRoutes);
app.use("/api", apiRoutes);
app.use("/api", healthRoutes);
app.use("/api", redisRoutes);
app.use("/api", postgresRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Flow Sheriff API is running 🚀",
  });
});

module.exports = app;