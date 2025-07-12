# CoLearn API Testing Guide

## Server Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Make sure PostgreSQL is running
   - Update the `.env` file with your database credentials
   - Current database connection: `postgresql://henil:root@localhost:5432/postgres?schema=colearn`

3. **Database Setup**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Start Server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

## Postman Testing

### Import Collection and Environment

1. **Import the Collection**
   - Open Postman
   - Click `Import` button
   - Select `CoLearn-API-Collection.postman_collection.json`

2. **Import the Environment**
   - In Postman, go to `Environments`
   - Click `Import` button
   - Select `CoLearn-Environment.postman_environment.json`
   - Set the environment as active

### Available API Endpoints

#### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/status` - Check authentication status
- `POST /api/auth/logout` - Logout current user

### Testing Flow

1. **Register a User**
   - Run the "Register User" request
   - Should return 201 with user data (password excluded)

2. **Login**
   - Run the "Login User" request
   - Should return 200 with user data and set session cookie

3. **Check Auth Status**
   - Run the "Check Auth Status" request
   - Should return authentication status

4. **Logout**
   - Run the "Logout User" request
   - Should clear session

### Error Testing

- **Missing Required Fields**: Test registration without required fields
- **Duplicate Email**: Try registering with the same email twice
- **Invalid Credentials**: Test login with wrong password

## Sample Request Bodies

### Register User
```json
{
  "email": "test@example.com",
  "password": "password123",
  "name": "John Doe",
  "location": "New York, NY",
  "profilePhoto": "https://example.com/photo.jpg",
  "isPublic": true
}
```

### Login User
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

## Important Notes

- The server uses session-based authentication with cookies
- Make sure to enable "Send cookies" in Postman for authentication to work
- The database schema includes additional models for skills, swap requests, and ratings
- All endpoints return JSON responses
- Error responses include appropriate HTTP status codes

## Server Status

Current server status: ✅ Running on http://localhost:3000
