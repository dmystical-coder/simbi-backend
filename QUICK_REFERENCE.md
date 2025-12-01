# SIMBI Backend - Quick Reference

## Server Info
- **URL:** http://localhost:3000
- **API Version:** v1
- **Status:** ✅ Running
- **Database:** ✅ Connected

## Start Commands
```bash
npm run dev        # Development (with hot reload)
npm start          # Production
npm run studio     # Database GUI
```

## API Base Paths
```
Authentication:    /api/v1/auth/*
Users:            /api/v1/users/*
Study Plans:      /api/v1/study-plan/*
Chat:             /api/v1/chat/*
Pre-Assessment:   /api/v1/pre-assessment
Notifications:    /api/notifications/*
Email:            /api/email
```

## Authentication Header
```
Authorization: Bearer <access_token>
```

## Key Documents
- 📖 **API_DOCS.md** - Full API reference
- 🚀 **SETUP_GUIDE.md** - Setup instructions
- ✅ **READY_FOR_FRONTEND.md** - Integration checklist
- 📮 **postman_collection.json** - API testing

## Common Requests

### Sign Up
```bash
POST /api/v1/auth/signup
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

### Login
```bash
POST /api/v1/auth/login
{
  "email": "string",
  "password": "string"
}
# Returns: { access_token, refresh_token }
```

### Get Current User
```bash
GET /api/v1/users/me
Authorization: Bearer <access_token>
```

### Generate Study Plan
```bash
POST /api/v1/study-plan/generate
Authorization: Bearer <access_token>
{
  "name": "string",
  "subjects": ["string"],
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "daysAvailable": ["Monday", "Wednesday"],
  "dailyStudyDuration": "2h",
  "breakDuration": "15m"
}
```

### Send Chat Message
```bash
POST /api/v1/chat/message
Authorization: Bearer <access_token>
{
  "message": "string"
}
```

## Environment Variables (Production)
```env
# Required
DATABASE_URL=postgresql://...
ACCESS_JWT_SECRET=strong-random-secret
REFRESH_JWT_SECRET=strong-random-secret
ALLOWED_ORIGINS=https://yourdomain.com
SIMBI_AI_KEY=your-key
GROQ_API_KEY=your-key

# Optional
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email
EMAIL_PASSWORD=your-password
```

## HTTP Status Codes
- `200` OK
- `201` Created
- `400` Bad Request (validation error)
- `401` Unauthorized (missing/invalid token)
- `403` Forbidden (insufficient permissions)
- `404` Not Found
- `500` Server Error

## Troubleshooting
| Issue | Solution |
|-------|----------|
| Port in use | Change `PORT` in .env |
| DB connection error | Check `DATABASE_URL` |
| CORS error | Add frontend URL to `ALLOWED_ORIGINS` |
| Token expired | Use refresh endpoint |
| Validation error | Check request body format |

## Need Help?
1. Check server logs in terminal
2. Review API_DOCS.md
3. Test with Postman collection
4. Verify .env variables
