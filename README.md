# 💰 Finance Dashboard API

A robust RESTful backend API for a finance dashboard system with **role-based access control (RBAC)**, financial records management, and **analytics/summary endpoints**. Built with Node.js, Express, MongoDB, and JWT authentication.

## 🏗️ Architecture

```
src/
├── config/           # Database & environment configuration
├── models/           # Mongoose schemas (User, FinancialRecord, TokenBlacklist)
├── routes/           # Express route definitions with Swagger docs
├── controllers/      # Request handling (thin layer)
├── services/         # Business logic (heavy layer)
├── middlewares/      # Auth, RBAC, validation, error handling
├── validators/       # Input validation rules (express-validator)
├── utils/            # ApiError, ApiResponse, constants
├── docs/             # Swagger/OpenAPI configuration
├── seeds/            # Database seeding script
└── app.js            # Express app setup
```

**Design Pattern**: Routes → Controllers → Services → Models
- **Controllers** are thin: parse request, call service, send response
- **Services** contain all business logic
- **Models** define data shape only

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| API Docs | Swagger UI |
| Security | helmet, cors, express-rate-limit |

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or Atlas cloud)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd finance_project

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 4. Seed the database (creates sample users & records)
npm run seed

# 5. Start the development server
npm run dev
```

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/finance_dashboard` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |

## 📖 API Documentation

Once the server is running, open **Swagger UI** at:

```
http://localhost:3000/api-docs
```

### API Endpoints Summary

#### 🔐 Authentication (4 endpoints)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login & get JWT token | ❌ |
| POST | `/api/auth/logout` | Logout & invalidate token | ✅ |
| GET | `/api/auth/me` | Get current user profile | ✅ |

#### 👥 User Management (5 endpoints) — Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users (paginated) |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user (name, email, role) |
| PATCH | `/api/users/:id/status` | Toggle active/inactive |
| DELETE | `/api/users/:id` | Delete a user |

#### 💰 Financial Records (5 endpoints)
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/records` | Create record | Analyst, Admin |
| GET | `/api/records` | List records (filter, search, paginate) | All |
| GET | `/api/records/:id` | Get single record | All |
| PUT | `/api/records/:id` | Update record | Analyst, Admin |
| DELETE | `/api/records/:id` | Soft-delete record | Admin |

#### 📊 Dashboard Analytics (4 endpoints) — Analyst & Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/summary` | Total income, expenses, net balance |
| GET | `/api/dashboard/category-summary` | Category-wise breakdown |
| GET | `/api/dashboard/trends` | Monthly trends (12 months) |
| GET | `/api/dashboard/recent` | 10 most recent transactions |

#### ❤️ Health (1 endpoint)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

**Total: 19 API endpoints**

## 🔒 Role-Based Access Control (RBAC)

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View financial records | ✅ | ✅ | ✅ |
| View dashboard summaries | ❌ | ✅ | ✅ |
| Create/Update records | ❌ | ✅ | ✅ |
| Delete records | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

## 🧪 Test Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `admin123` |
| Analyst | `analyst@example.com` | `analyst123` |
| Viewer | `viewer@example.com` | `viewer123` |

## 🔍 Record Filtering & Search

`GET /api/records` supports:
- `?type=income|expense` — Filter by type
- `?category=Salary` — Filter by category
- `?startDate=2025-01-01&endDate=2025-03-31` — Date range
- `?search=keyword` — Text search in description
- `?sortBy=date|amount|createdAt&order=asc|desc` — Sorting
- `?page=1&limit=10` — Pagination

## ✨ Key Features

- **JWT Authentication** with token blacklisting on logout
- **Role-Based Access Control** via middleware
- **Soft Delete** for financial records (data is never permanently lost)
- **Input Validation** with detailed error messages
- **Centralized Error Handling** with consistent response format
- **Rate Limiting** on auth routes (brute force protection)
- **Pagination** on all list endpoints
- **Text Search** on record descriptions
- **MongoDB Aggregation Pipelines** for dashboard analytics
- **Swagger UI** for interactive API documentation
- **Security Headers** via Helmet
- **Database Seeding** for quick testing

## 📝 Assumptions & Design Decisions

1. **New users default to "viewer" role** — Only admins can promote users
2. **Soft delete for records** — Records are flagged as deleted, not removed from DB
3. **Token blacklisting for logout** — Tokens are stored in a TTL-indexed collection that auto-cleans expired tokens
4. **Admins cannot deactivate/delete themselves** — Prevents accidental lockout
5. **Password must be at least 6 characters** — Basic password length requirement
6. **Record dates cannot be in the future** — Prevents invalid data entry
7. **Categories are predefined** — Ensures data consistency for aggregation

## 📜 Scripts

```bash
npm run dev     # Start with nodemon (development)
npm start       # Start normally (production)
npm run seed    # Seed database with sample data
```

## 📄 License

ISC
