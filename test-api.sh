#!/bin/bash

# SIMBI Backend API Test Script
# Use this to test if endpoints are working

BASE_URL="http://localhost:3000"
API_VERSION="1"

echo "================================"
echo "SIMBI Backend API Test"
echo "================================"
echo ""

# Test 1: Health Check
echo "1. Testing Health Check..."
HEALTH=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/")
echo "$HEALTH"
echo ""

# Test 2: Sign Up
echo "2. Testing Sign Up Endpoint..."
echo "URL: $BASE_URL/api/v$API_VERSION/auth/signup"
SIGNUP=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE_URL/api/v$API_VERSION/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser'$(date +%s)'",
    "email": "test'$(date +%s)'@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }')
echo "$SIGNUP"
echo ""

# Test 3: Login (will fail if signup failed)
echo "3. Testing Login Endpoint..."
echo "URL: $BASE_URL/api/v$API_VERSION/auth/login"
LOGIN=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE_URL/api/v$API_VERSION/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }')
echo "$LOGIN"
echo ""

# Test 4: Test 404 endpoint
echo "4. Testing 404 (should return error)..."
echo "URL: $BASE_URL/api/v$API_VERSION/nonexistent"
NOTFOUND=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/api/v$API_VERSION/nonexistent")
echo "$NOTFOUND"
echo ""

echo "================================"
echo "Common Frontend Issues:"
echo "================================"
echo ""
echo "If you're getting 404 from frontend:"
echo ""
echo "1. CHECK THE URL:"
echo "   ✓ Correct:   http://localhost:3000/api/v1/auth/signup"
echo "   ✗ Wrong:     http://localhost:3000/auth/signup"
echo "   ✗ Wrong:     http://localhost:3000/api/auth/signup"
echo ""
echo "2. CHECK THE METHOD:"
echo "   ✓ Correct:   POST"
echo "   ✗ Wrong:     GET"
echo ""
echo "3. CHECK HEADERS:"
echo "   ✓ Required:  Content-Type: application/json"
echo ""
echo "4. CHECK CORS:"
echo "   - Open browser console"
echo "   - Look for CORS errors"
echo "   - Current ALLOWED_ORIGINS: Check .env file"
echo ""
echo "5. CHECK SERVER IS RUNNING:"
echo "   - Run: curl http://localhost:3000/"
echo "   - Should return: Welcome to Simbi-Backend"
echo ""
echo "================================"
