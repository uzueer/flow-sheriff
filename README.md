# 🚦 Distributed Rate Limiter

A distributed rate limiter built with **Node.js**, **Express.js**, **Redis**, and **PostgreSQL** to control API request rates across multiple server instances.

Instead of storing request counts on individual servers, the application uses **Redis** as a centralized store, ensuring consistent rate limiting even when requests are handled by different backend instances behind a load balancer.

## ✨ Features

- Distributed rate limiting
- Token Bucket algorithm
- Redis-based shared state
- Express middleware
- PostgreSQL for request logging
- Docker support
- Scalable architecture

## 🛠️ Tech Stack

- Node.js
- Express.js
- Redis
- PostgreSQL
- Docker

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/distributed-rate-limiter.git

cd distributed-rate-limiter

npm install
```

Run Redis and PostgreSQL, configure your `.env` file, and start the server.

```bash
npm run dev
```

---

This project is being built to demonstrate backend system design concepts such as distributed systems, caching, middleware, and scalable API architecture.
