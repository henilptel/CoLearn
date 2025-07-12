# Sample API Requests & Responses

## 1. Register User

### Request
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "location": "San Francisco, CA",
  "profilePhoto": "https://example.com/photos/john.jpg",
  "isPublic": true
}
```

### Success Response (201 Created)
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "location": "San Francisco, CA",
    "profilePhoto": "https://example.com/photos/john.jpg",
    "isPublic": true,
    "createdAt": "2025-07-12T06:30:00.000Z",
    "updatedAt": "2025-07-12T06:30:00.000Z",
    "isActive": true
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "message": "Email, password, name and Profile View status are required."
}
```

### Error Response (409 Conflict)
```json
{
  "message": "Email already registered."
}
```

---

## 2. Login User

### Request
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Success Response (200 OK)
```json
{
  "message": "Logged in successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "location": "San Francisco, CA",
    "profilePhoto": "https://example.com/photos/john.jpg",
    "isPublic": true,
    "createdAt": "2025-07-12T06:30:00.000Z",
    "updatedAt": "2025-07-12T06:30:00.000Z",
    "isActive": true
  }
}
```

### Error Response (401 Unauthorized)
```json
{
  "message": "Incorrect email."
}
```
or
```json
{
  "message": "Incorrect password."
}
```

---

## 3. Check Auth Status

### Request
```http
GET http://localhost:3000/api/auth/status
```

### Success Response - Authenticated (200 OK)
```json
{
  "authenticated": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "location": "San Francisco, CA",
    "profilePhoto": "https://example.com/photos/john.jpg",
    "isPublic": true,
    "createdAt": "2025-07-12T06:30:00.000Z",
    "updatedAt": "2025-07-12T06:30:00.000Z",
    "isActive": true
  }
}
```

### Success Response - Not Authenticated (200 OK)
```json
{
  "authenticated": false
}
```

---

## 4. Logout User

### Request
```http
POST http://localhost:3000/api/auth/logout
```

### Success Response (200 OK)
```json
{
  "message": "Logged out successfully"
}
```

---

## Testing Workflow

### 1. Complete Registration & Login Flow
```bash
# Step 1: Register a new user
POST /api/auth/register (with user data)

# Step 2: Login with the registered user
POST /api/auth/login (with email/password)

# Step 3: Check authentication status
GET /api/auth/status (should show authenticated: true)

# Step 4: Logout
POST /api/auth/logout

# Step 5: Check status again
GET /api/auth/status (should show authenticated: false)
```

### 2. Error Testing Flow
```bash
# Test missing fields
POST /api/auth/register (missing required fields)

# Test duplicate registration
POST /api/auth/register (same email twice)

# Test invalid login
POST /api/auth/login (wrong password)
```

## cURL Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "isPublic": true
  }'
```

### Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Check Status (with cookies)
```bash
curl -X GET http://localhost:3000/api/auth/status \
  -b cookies.txt
```

### Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```
