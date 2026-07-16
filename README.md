# Book Shop Management System API

A production-ready REST API for managing a book shop — built with Node.js, Express.js, PostgreSQL, Sequelize ORM, JWT Authentication, and Node.js Cluster for multi-core CPU utilization.

---

## Tech Stack

- Node.js (ES Modules)
- Express.js
- PostgreSQL + Sequelize ORM
- JWT Authentication
- bcryptjs (password hashing)
- Helmet + CORS (security)
- Node.js Cluster (multi-core)
- dotenv

---

## Project Structure

```
project-root/
├── src/
│   ├── config/          # DB, server, JWT configs
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── models/          # Sequelize models + associations
│   ├── routes/          # Express routers
│   ├── middleware/      # Auth + error middleware
│   ├── validations/     # Request validators
│   ├── utils/           # Response formatter, pagination
│   ├── constants/       # Shared message strings
│   ├── helpers/         # JWT token helpers
│   ├── app.js           # Express app setup
│   └── server.js        # Cluster entry point
├── .env
├── .env.example
├── package.json
└── README.md
```

---

## Setup

### 1. Prerequisites

- Node.js >= 18
- PostgreSQL running locally (or remote)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and JWT secret:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=book_shop_db
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

### 4. Create the database

```sql
CREATE DATABASE book_shop_db;
```

### 5. Start the server

```bash
# Production (with cluster)
npm start

# Development (with nodemon)
npm run dev
```

Tables are auto-synced on startup via Sequelize.

---

## API Reference

All protected routes require:
```
Authorization: Bearer <token>
```

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and get token |
| GET | `/api/auth/profile` | Yes | Get current user profile |

#### Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "admin"
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "secret123"
}
```

---

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/categories` | Create category |
| GET | `/api/categories?page=1&limit=10` | List categories |
| GET | `/api/categories/:id` | Get category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

---

### Books

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/books` | Create book |
| GET | `/api/books?search=&categoryId=&page=&limit=` | List/search books |
| GET | `/api/books/:id` | Get book |
| PUT | `/api/books/:id` | Update book |
| DELETE | `/api/books/:id` | Delete book |
| PATCH | `/api/books/:id/stock` | Update stock |

#### Search books
```
GET /api/books?search=harry&categoryId=2&page=1&limit=10
```

#### Update stock
```json
PATCH /api/books/:id/stock
{ "quantity": 50 }
```
Use negative values to decrement.

---

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/customers` | Create customer |
| GET | `/api/customers?page=1&limit=10` | List customers |
| GET | `/api/customers/:id` | Get customer |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |

---

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders?page=1&limit=10` | List orders |
| GET | `/api/orders/:id` | Get order |
| PUT | `/api/orders/:id` | Update order status |
| DELETE | `/api/orders/:id` | Delete order |

#### Create order
```json
POST /api/orders
{
  "customerId": 1,
  "items": [
    { "bookId": 1, "quantity": 2 },
    { "bookId": 3, "quantity": 1 }
  ]
}
```
Stock is automatically decremented on order creation. Insufficient stock returns a 400 error.

---

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

Paginated list responses include:
```json
{
  "success": true,
  "message": "...",
  "data": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "books": [...]
  }
}
```

---

## Cluster Behavior

On startup, the master process forks one worker per CPU core. If a worker crashes, the master automatically restarts it. Each worker logs its PID.

```
[Master] PID 1234 is running
[Master] Forking 8 workers...
[Master] Worker PID 1235 is online
[Worker 1235] Database connected
[Worker 1235] Server listening on port 5000
```

---

## Security

- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens with configurable expiry
- Helmet sets secure HTTP headers
- CORS configurable via `CORS_ORIGIN` env var
- All sensitive config via environment variables
