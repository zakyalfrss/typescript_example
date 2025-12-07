# 🚀 Express TypeScript Backend API

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748)
![Postgresql](https://img.shields.io/badge/Posgres-18.x-lightblue)

A clean, scalable, and production-ready backend API built with Express.js, TypeScript, Prisma ORM, and Postgres/PostgreSQL. Features modular architecture, JWT authentication, and comprehensive error handling.

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Scripts](#-scripts)
- [Project Architecture](#-project-architecture)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- ✅ **TypeScript** - Full type safety and modern JavaScript features
- ✅ **Express.js** - Fast, unopinionated web framework
- ✅ **Prisma ORM** - Next-generation ORM for TypeScript & Node.js
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Modular Architecture** - Clean separation of concerns
- ✅ **Input Validation** - Comprehensive validation with Zod
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **Environment Configuration** - Secure configuration management
- ✅ **Postgres/PostgreSQL** - Flexible database support
- ✅ **CORS Enabled** - Cross-origin resource sharing
- ✅ **Security Headers** - Helmet.js for security
- ✅ **Logging** - Request logging with Morgan
- ✅ **Compression** - Response compression

## 📁 Project Structure

```txt
backend/
├── src/
│   ├── app.ts                # Express app configuration
│   ├── server.ts             # Server startup & shutdown
│   ├── config/
│   │   └── env.ts            # Environment configuration
│   ├── middlewares/
│   │   ├── auth.middleware.ts        # Authentication middleware
│   │   ├── error.middleware.ts       # Error handling middleware
│   │   └── validation.middleware.ts  # Request validation
│   ├── modules/
│   │   ├── auth/             # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.repository.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.schema.ts
│   │   │   ├── auth.service.ts
│   │   │   └── index.ts
│   │   └── users/            # Users module
│   │       ├── user.controller.ts
│   │       ├── user.repository.ts
│   │       ├── user.route.ts
│   │       ├── user.service.ts
│   │       └── index.ts
│   ├── routes/
│   │   └── index.ts          # Main routes configuration
│   ├── utils/                # Utility functions
│   │   ├── auth.ts
│   │   ├── password.ts
│   │   ├── response.ts
│   │   └── token.ts
│   └── prisma.ts             # Prisma client configuration
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

text

## 🛠 Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git** (for version control)
- **Database** (Postgres for development, PostgreSQL for production)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
Install dependencies

bash
npm install
Set up environment variables

bash
cp .env.example .env
Edit .env file with your configuration.

Set up the database

bash
npx prisma generate
npx prisma db push
# or for migrations
npx prisma migrate dev --name init
🔧 Environment Variables
Create a .env file in the root directory:

env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-characters
JWT_EXPIRES_IN=24h

# Database Configuration (Postgres for development)
DATABASE_URL="file:./dev.db"

# Database Configuration (PostgreSQL for production)
# DATABASE_URL="postgresql://username:password@localhost:5432/database?schema=public"

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
🗄️ Database Setup
Using Postgres (Development)
bash
# Update .env
DATABASE_URL="file:./dev.db"

# Generate Prisma client
npx prisma generate

# Create database
npx prisma db push
Using PostgreSQL (Production)
bash
# Update .env
DATABASE_URL="postgresql://username:password@localhost:5432/database?schema=public"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
View Database with Prisma Studio
bash
npx prisma studio
Open http://localhost:5555 in your browser.

🚀 Running the Application
Development Mode
bash
npm run dev
Server runs at http://localhost:3000 with hot reload.

Production Build
bash
# Build the application
npm run build

# Run production server
npm start
Type Checking
bash
npm run type-check
📖 API Documentation
Base URL
text
http://localhost:3000/api
Authentication Endpoints
Register User
http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
Login
http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
Get Profile
http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
Change Password
http
PUT /api/auth/change-password
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmNewPassword": "newPassword123"
}
User Management Endpoints (Protected)
Get All Users
http
GET /api/users
Authorization: Bearer <jwt_token>
Query Parameters:
  ?page=1&limit=10&email=search
Get User by ID
http
GET /api/users/:id
Authorization: Bearer <jwt_token>
Create User (Admin)
http
POST /api/users
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "Password123"
}
Update User
http
PUT /api/users/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "email": "updated@example.com"
}
Delete User
http
DELETE /api/users/:id
Authorization: Bearer <jwt_token>
Health Check
http
GET /health
🧪 Testing
Test API with curl
bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123","confirmPassword":"Password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'
Test with PowerShell Script
powershell
# Run test script
.\test-api.ps1
📜 Scripts
npm run dev - Start development server with hot reload

npm run build - Build TypeScript to JavaScript

npm start - Run production server

npm run type-check - Type check without emitting

npx prisma generate - Generate Prisma client

npx prisma migrate - Run database migrations

npx prisma studio - Open Prisma Studio GUI

npx prisma db push - Push schema to database

🏗️ Project Architecture
Modular Pattern
The project follows a clean modular architecture:

text
Controller → Service → Repository → Database
    ↓           ↓           ↓
   HTTP      Business     Database
  Logic       Logic       Operations
Key Components
Controllers - Handle HTTP requests and responses

Services - Business logic layer

Repositories - Database operations

Middlewares - Request processing and authentication

Utils - Helper functions and utilities

Schemas - Input validation with Zod

Error Handling
Centralized error handling with custom AppError class:

Operational errors (user input, validation)

Programming errors (bugs, system failures)

Database errors (Prisma exceptions)

Authentication errors (JWT, permissions)

🚢 Deployment
Deploy to Production
Set up production environment

bash
NODE_ENV=production
JWT_SECRET=strong-production-secret
DATABASE_URL=postgresql://user:pass@host:5432/db
Build the application

bash
npm run build
Run database migrations

bash
npx prisma migrate deploy
Start the server

bash
npm start
Docker Deployment (Optional)
dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

Development Guidelines
Follow TypeScript best practices

Write meaningful commit messages

Add tests for new features

Update documentation as needed

Use ESLint and Prettier for code formatting

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Express.js - Web framework for Node.js

TypeScript - JavaScript with syntax for types

Prisma - Next-generation ORM

Zod - TypeScript-first schema validation

📞 Support
For support, email [your-email] or open an issue in the GitHub repository.

Happy Coding! 🚀

Built with ❤️ using Node.js, Express, TypeScript, and Prisma.

text

## Versi Ringkas (README-minimal.md):

```markdown
# Express TypeScript Backend

Backend API dengan Express.js, TypeScript, dan Prisma ORM.

## 🚀 Quick Start

```bash
# 1. Clone & install
git clone <repo>
cd backend
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env file

# 3. Setup database
npx prisma generate
npx prisma db push

# 4. Run server
npm run dev
📖 API Endpoints
Authentication
POST /api/auth/register - Register user

POST /api/auth/login - Login

GET /api/auth/profile - Get profile (protected)

Users
GET /api/users - Get all users (protected)

GET /api/users/:id - Get user by ID (protected)

POST /api/users - Create user (protected)

PUT /api/users/:id - Update user (protected)

DELETE /api/users/:id - Delete user (protected)

🛠 Scripts
npm run dev - Development server

npm run build - Build for production

npm start - Production server

npx prisma studio - Database GUI

📦 Tech Stack
Node.js + Express

TypeScript

Prisma ORM

Postgres/PostgreSQL

JWT Authentication

Zod Validation

📄 License
MIT

text

## Cara Membuat File README:

### Di PowerShell:
```powershell
# Buat file README.md
echo "# 🚀 Express TypeScript Backend API

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748)
![Postgres](https://img.shields.io/badge/Postgres-3.x-003B57)

A clean, scalable, and production-ready backend API built with Express.js, TypeScript, Prisma ORM, and Postgres/PostgreSQL.

## ✨ Features

- ✅ **TypeScript** - Full type safety
- ✅ **Express.js** - Fast web framework
- ✅ **Prisma ORM** - Next-generation ORM
- ✅ **JWT Authentication** - Secure authentication
- ✅ **Modular Architecture** - Clean separation
- ✅ **Input Validation** - Zod validation
- ✅ **Postgres/PostgreSQL** - Flexible database

## 🚀 Quick Start

\`\`\`bash
# Clone & install
git clone <repo>
cd backend
npm install

# Setup environment
cp .env.example .env
# Edit .env file

# Setup database
npx prisma generate
npx prisma db push

# Run server
npm run dev
\`\`\`

Server runs at: http://localhost:3000

## 📖 API Documentation

### Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

### Authentication
- \`POST /api/auth/register\` - Register user
- \`POST /api/auth/login\` - Login user  
- \`GET /api/auth/profile\` - Get profile (protected)

### Health Check
- \`GET /health\` - Server health status

## 🛠 Scripts

- \`npm run dev\` - Development with hot reload
- \`npm run build\` - Build for production
- \`npm start\` - Production server
- \`npm run type-check\` - Type checking
- \`npx prisma studio\` - Database GUI

## 📁 Project Structure

\`\`\`
src/
├── app.ts                    # Express app
├── server.ts                 # Server startup
├── config/                   # Configuration
├── middlewares/              # Custom middlewares  
├── modules/                  # Feature modules
├── routes/                   # API routes
├── utils/                    # Utilities
└── prisma.ts                # Database client
\`\`\`

## 📄 License

MIT License

## 🙏 Support

For issues, open a GitHub ticket.

---

**Happy Coding!** 🚀" > README.md

# Verifikasi
cat README.md
