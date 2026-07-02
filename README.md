# 🚦 Flow Sheriff

> A distributed API rate limiter built with **Node.js, Express, Redis, PostgreSQL, and Docker** using the **Token Bucket Algorithm**. Flow Sheriff protects APIs from excessive traffic while providing request analytics, logging, and system monitoring through a dashboard.

---

## ✨ Features

- 🚀 Distributed Token Bucket Rate Limiter
- ⚡ Redis-backed request throttling
- 📝 PostgreSQL request logging
- 📊 Analytics APIs for dashboard metrics
- ❤️ Health monitoring endpoints
- 🐳 Dockerized Redis & PostgreSQL
- 🔄 Automatic token refill
- ⏱️ Configurable bucket capacity & refill rate
- 📦 Clean backend architecture
- 🎨 Frontend dashboard (currently being integrated)

---

## 🏗️ Architecture

```text
                 Client
                    │
                    ▼
            Express API Server
                    │
          Rate Limiter Middleware
                    │
            Token Bucket Service
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
      Redis              PostgreSQL
         │                     ▲
         │                     │
         └──── Logger Middleware
                    │
                    ▼
             Analytics APIs
                    │
                    ▼
           React Dashboard
```

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js

### Database
- Redis
- PostgreSQL

### DevOps
- Docker
- Docker Compose

### Frontend
- React
- TanStack Start
- TypeScript

---

## 📂 Project Structure

```text
flow-sheriff/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Setup

### Clone Repository

```bash
git clone https://github.com/uzueer/flow-sheriff.git
cd flow-sheriff
```

### Start Redis & PostgreSQL

```bash
docker compose up -d
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🔧 Environment Variables

Create a `.env` inside the `backend` folder.

```env
PORT=5000

REDIS_HOST=localhost
REDIS_PORT=6379

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=ratelimiter

RATE_LIMIT_CAPACITY=10
RATE_LIMIT_REFILL_RATE=2
BUCKET_TTL=3600
```

---

## 📡 API Endpoints

### Test Rate Limiter

```
GET /api/test
```

Tests the Token Bucket algorithm.

---

### Analytics

```
GET /api/stats
```

Returns:

- Total Requests
- Allowed Requests
- Blocked Requests
- Active Clients
- Average Response Time

---

### Request Logs

```
GET /api/logs
```

Returns the latest logged API requests.

---

### Health Check

```
GET /api/health
```

Checks the status of:

- Redis
- PostgreSQL

---

### PostgreSQL Info

```
GET /api/postgres
```

Returns PostgreSQL version and active database connections.

---

## 🧠 How It Works

1. Every incoming request passes through the **Rate Limiter Middleware**.
2. A **Token Bucket** is maintained in Redis for each client.
3. If a token is available:
   - The request is allowed.
   - A token is consumed.
4. If no tokens remain:
   - The API responds with **HTTP 429 Too Many Requests**.
5. Every request is logged into PostgreSQL.
6. Analytics APIs aggregate request data for the dashboard.

---

## 🚀 Current Features

- ✅ Redis Token Bucket implementation
- ✅ Automatic token refill
- ✅ Configurable rate limits
- ✅ Request logging
- ✅ Analytics APIs
- ✅ Health monitoring
- ✅ Dockerized services
- ✅ PostgreSQL integration

---

## 🚧 Upcoming Features

- Live dashboard integration
- Real-time analytics using WebSockets/SSE
- Multi-node rate limiter support
- API key based rate limiting
- Redis cluster support
- Prometheus metrics
- Grafana dashboard
- AWS deployment

---

## 📸 Preview

> Dashboard integration is currently in progress.

---

## 👨‍💻 Author

**Syed Uzair**

- LinkedIn: https://www.linkedin.com/in/syeduzairn/
- GitHub: https://github.com/uzueer

---
