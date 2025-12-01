# Simbi Backend

A backend API service developed by Efemena Esegbue, Blessing Asuquo, and Daniel Nwolu.

## 🚀 Quick Links

- **[Setup Guide](SETUP_GUIDE.md)** - Local development setup
- **[API Documentation](API_DOCS.md)** - Complete API reference
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Pre-Deployment Checklist](PRE_DEPLOYMENT_CHECKLIST.md)** - Checklist before going live
- **[Quick Reference](QUICK_REFERENCE.md)** - Quick command reference

## Table of Contents

- [Project Overview](#project-overview)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Database Setup](#database-setup)
- [Available Scripts](#available-scripts)
- [API Routes](#api-routes)
- [Production Deployment](#production-deployment)
- [License](#license)
- [Contributors](#contributors)

## Project Overview

Simbi Backend is a Node.js application built with Express and TypeScript, utilizing Prisma as an ORM for database operations. The project follows a structured architecture with separate directories for controllers, services, routes, and database configuration.

## Directory Structure

```
.
├── LICENSE
├── README.md
├── package-lock.json
├── package.json
├── src
│   ├── app.ts                  # Express application setup
│   ├── config
│   │   ├── cors.ts             # CORS configuration
│   │   └── settings.ts         # Application settings
│   ├── controllers             # Request handlers
│   ├── database
│   │   └── db.ts               # Database connection
│   ├── prisma
│   │   ├── generated           # Prisma generated files
│   │   ├── migrations          # Database migrations
│   │   └── schema.prisma       # Prisma schema
│   ├── routes                  # API routes
│   ├── server.ts               # Server entry point
│   ├── services                # Business logic
│   └── utils
│       ├── errorClasses.ts     # Custom error classes
│       ├── errorMiddleware.ts  # Error handling middleware
│       └── logger.ts           # Logging utility
└── tsconfig.json               # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm
- A database supported by Prisma (PostgreSQL, MySQL, SQLite, etc.)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/Sparklingbae/Simbi-Backend.git
   cd Simbi-Backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your database connection details:

   ```
   DATABASE_URL=your_database_connection_string
   PORT=3000
   ```

## Database Setup

1. Generate Prisma Client:

   ```
   npm run generate:dev
   ```

2. Run database migrations:

   ```
   npm run migrate:dev
   ```

3. Open Prisma Studio to explore and manipulate your database:

   ```
   npm run studio
   ```

## Available Scripts

- `npm run build` - Compiles TypeScript to JavaScript in the dist directory
- `npm run dev` - Starts the development server with hot-reloading
- `npm start` - Runs the compiled JavaScript code in production
- `npm run migrate:dev` - Runs Prisma migrations in development
- `npm run generate:dev` - Generates Prisma client in development
- `npm run migrate` - Runs Prisma migrations in production
- `npm run generate` - Generates Prisma client in production
- `npm run studio` - Opens Prisma Studio for visual database management

## Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Complete setup instructions for development and production
- **[API Documentation](API_DOCS.md)** - Comprehensive API reference for frontend integration

## API Routes

The backend provides the following API endpoints:

- **Authentication** - `/api/v1/auth/*` (signup, login, refresh)
- **User Management** - `/api/v1/users/*` (profile, update, delete)
- **Study Plans** - `/api/v1/study-plan/*` (generate, manage, track progress)
- **Chat** - `/api/v1/chat/*` (AI assistant conversations)
- **Pre-Assessment** - `/api/v1/pre-assessment` (learning style assessment)
- **Notifications** - `/api/notifications/*` (user notifications)
- **Email** - `/api/email` (email services)

For detailed endpoint information, see [API_DOCS.md](API_DOCS.md).

## Quick Start for Frontend Developers

1. Ensure the backend is running on `http://localhost:3000`
2. Review [API_DOCS.md](API_DOCS.md) for all available endpoints
3. Use the authentication flow to get access tokens
4. Include the access token in the `Authorization: Bearer <token>` header for protected routes

## Production Deployment

Ready to deploy? Follow these steps:

1. **Read the Pre-Deployment Checklist** - [PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md)
2. **Configure Production Environment** - See `.env.production.example`
3. **Choose Deployment Platform** - Railway (recommended), Render, or VPS
4. **Follow Deployment Guide** - [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Quick Deploy to Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway add --database postgres
railway up

# Set environment variables
railway variables set ALLOWED_ORIGINS="https://your-frontend.com"
railway variables set ENVIRONMENT="production"
# ... (see PRE_DEPLOYMENT_CHECKLIST.md for all variables)

# Get your production URL
railway domain
```

**Time to deploy: ~15 minutes**

For detailed instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Contributors

- Efemena Esegbue
- Daniel Nwolu
- Blessing Asuquo
