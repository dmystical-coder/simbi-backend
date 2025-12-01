# SIMBI Backend - Setup Guide

This guide will help you set up the SIMBI AI backend for frontend consumption.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **PostgreSQL** database (or access to a cloud PostgreSQL instance like Neon)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/SimbiOrg/simbi-backend.git
cd simbi-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and update it with your actual values:

```bash
cp .env.example .env
```

Edit the `.env` file and configure the following required variables:

```env
# Server Configuration
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@host:port/database"
DATABASE_URL_TEST="postgresql://user:password@host:port/test_database"

# JWT Secrets (IMPORTANT: Change these in production!)
ACCESS_JWT_SECRET="your-secure-access-secret-key"
REFRESH_JWT_SECRET="your-secure-refresh-secret-key"
JWT_EXPIRATION_MINUTES=15
JWT_EXPIRATION_HOURS=24

# Security
SALT_ROUNDS=10

# API Configuration
API_VERSION=1
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000

# AI Services
SIMBI_AI_KEY="your-simbi-ai-api-key"
GROQ_API_KEY="your-groq-api-key"

# Email Configuration (Optional)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@example.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="SIMBI AI <noreply@simbi.ai>"

# Environment
ENVIRONMENT=development
```

### 4. Set Up the Database

Generate Prisma Client:
```bash
npm run generate:dev
```

Run database migrations:
```bash
npm run migrate:dev
```

### 5. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 6. Verify the Setup

Test the health endpoint:
```bash
curl http://localhost:3000/
```

Expected response:
```json
{
  "status": "success",
  "message": "Welcome to Simbi-Backend"
}
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript for production
- `npm start` - Start production server
- `npm run migrate:dev` - Run database migrations (development)
- `npm run generate:dev` - Generate Prisma client (development)
- `npm run studio` - Open Prisma Studio (database GUI)

## Production Deployment

### 1. Build the Project

```bash
npm run build:prod
```

This will:
- Generate Prisma client
- Compile TypeScript to JavaScript
- Copy necessary files to `dist/` directory
- Run migrations

### 2. Set Production Environment Variables

Update your `.env` file or set environment variables:

```env
ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-frontend-domain.com
# Update other sensitive keys
```

### 3. Start the Production Server

```bash
npm start
```

## Database Management

### View Database (Prisma Studio)

```bash
npm run studio
```

This opens a browser-based GUI at `http://localhost:5555` to view and edit your database.

### Create New Migrations

After modifying `src/prisma/schema.prisma`:

```bash
npm run migrate:dev
```

## API Documentation

Comprehensive API documentation is available in `API_DOCS.md`. It includes:
- All available endpoints
- Request/response formats
- Authentication flow
- Error handling
- Frontend integration notes

## CORS Configuration

For frontend integration, update `ALLOWED_ORIGINS` in `.env`:

**Development (allow all origins):**
```env
ALLOWED_ORIGINS=*
```

**Production (specific origins):**
```env
ALLOWED_ORIGINS=https://app.simbi.ai,https://www.simbi.ai
```

Multiple origins should be comma-separated.

## Testing the API

### Using cURL

**Sign Up:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Current User (requires auth token):**
```bash
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Common Issues and Solutions

### Issue: Database Connection Error
**Error:** `Invalid value undefined for datasource "db"`

**Solution:** Ensure `DATABASE_URL` and `DATABASE_URL_TEST` are properly set in `.env`

### Issue: Prisma Client Not Found
**Error:** `Cannot find module '@prisma/client'`

**Solution:** Run `npm run generate:dev` to generate the Prisma client

### Issue: Port Already in Use
**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:** Change the `PORT` in `.env` or kill the process using port 3000:
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue: CORS Errors
**Error:** Frontend getting CORS errors

**Solution:** Add your frontend URL to `ALLOWED_ORIGINS` in `.env`

## Security Recommendations

1. **Never commit `.env` to version control** - It's already in `.gitignore`
2. **Use strong JWT secrets** - Generate random strings for production
3. **Update ALLOWED_ORIGINS** - Don't use `*` in production
4. **Use HTTPS in production** - Secure your API endpoints
5. **Rotate secrets regularly** - Update JWT secrets and API keys periodically
6. **Use environment-specific databases** - Separate dev, staging, and production databases

## Frontend Integration Checklist

- [ ] Backend server running and accessible
- [ ] Database connected and migrated
- [ ] Environment variables configured
- [ ] CORS configured for frontend domain
- [ ] API endpoints tested
- [ ] Authentication flow tested
- [ ] API documentation shared with frontend team
- [ ] Error handling verified
- [ ] Health check endpoint working

## Support

For issues or questions:
- Check `API_DOCS.md` for endpoint details
- Review error logs in the terminal
- Ensure all environment variables are set correctly
- Verify database connection

## Next Steps

1. Review `API_DOCS.md` for complete API reference
2. Test all endpoints using Postman or similar tool
3. Share API base URL and documentation with frontend team
4. Set up proper logging and monitoring for production
5. Implement rate limiting if needed
6. Set up automated backups for production database

---

**Ready for Frontend Integration!** 🚀

The backend is now fully configured and ready to serve your frontend application. All endpoints are documented in `API_DOCS.md`.
