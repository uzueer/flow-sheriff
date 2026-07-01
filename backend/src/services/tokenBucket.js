const { redisClient } = require("../config/redis");

const CAPACITY = Number(process.env.RATE_LIMIT_CAPACITY) || 10;
const REFILL_RATE = Number(process.env.RATE_LIMIT_REFILL_RATE) || 2;
const TTL = Number(process.env.BUCKET_TTL) || 3600;

async function checkRateLimit(clientId) {
  const key = `bucket:${clientId}`;

  const currentTime = Date.now();

  let bucket = await redisClient.get(key);

  if (!bucket) {
    bucket = {
      tokens: CAPACITY,
      lastRefill: currentTime,
    };
  } else {
    try {
      bucket = JSON.parse(bucket);
    } catch {
      bucket = {
        tokens: CAPACITY,
        lastRefill: currentTime,
      };
    }
  }

  // Calculate elapsed time
  const elapsedTime = (currentTime - bucket.lastRefill) / 1000;

  // Calculate tokens to refill
  const refillTokens = elapsedTime * REFILL_RATE;

  // Refill bucket
  bucket.tokens = Math.min(
    CAPACITY,
    bucket.tokens + refillTokens
  );

  bucket.lastRefill = currentTime;

  let allowed = false;
  let retryAfter = 0;

  if (bucket.tokens >= 1) {
    bucket.tokens--;
    allowed = true;
  } else {
    retryAfter = Math.ceil((1 - bucket.tokens) / REFILL_RATE);
  }

  await redisClient.set(key, JSON.stringify(bucket));

  await redisClient.expire(key, TTL);

  return {
    allowed,
    remainingTokens: Math.floor(bucket.tokens),
    capacity: CAPACITY,
    retryAfter,
  };
}

module.exports = {
  checkRateLimit,
};