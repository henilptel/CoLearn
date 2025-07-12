# CoLearn API Testing Kit 🚀

This folder contains everything you need to test the CoLearn backend APIs using Postman.

## 📁 Files Included

### Postman Collection & Environment
- **`CoLearn-API-Collection.postman_collection.json`** - Complete API collection with all authentication endpoints
- **`CoLearn-Environment.postman_environment.json`** - Environment variables for easy testing

### Documentation
- **`API-Testing-Guide.md`** - Detailed testing instructions and workflows
- **`sample-requests.md`** - Sample request/response examples
- **`README.md`** - This file

## 🔗 Quick Links for Sharing

### Option 1: GitHub Repository
The files are already in your GitHub repository at:
```
https://github.com/henilptel/CoLearn/tree/dev/api-testing
```

### Option 2: Download Links
You can share individual files:
- [Postman Collection](./CoLearn-API-Collection.postman_collection.json)
- [Postman Environment](./CoLearn-Environment.postman_environment.json)
- [Testing Guide](./API-Testing-Guide.md)

### Option 3: Cloud Storage
Upload this entire folder to:
- Google Drive
- Dropbox
- OneDrive
- Any cloud storage service

### Option 4: Postman Workspace
1. Import the collection to your Postman workspace
2. Share the workspace with team members
3. Collaborate directly in Postman

## 🚀 Quick Start

1. **Download the files** from this folder
2. **Import in Postman:**
   - Collection: `CoLearn-API-Collection.postman_collection.json`
   - Environment: `CoLearn-Environment.postman_environment.json`
3. **Set environment** as active in Postman
4. **Start testing** the APIs!

## 📋 Available Endpoints

### Authentication APIs
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user  
- `GET /api/auth/status` - Check auth status
- `POST /api/auth/logout` - Logout user

### Test Cases Included
- ✅ Valid registration
- ✅ Valid login
- ✅ Auth status check
- ✅ Logout
- ❌ Missing required fields
- ❌ Duplicate email registration
- ❌ Invalid credentials

## 🔧 Server Requirements

- **Backend Server:** `http://localhost:3000`
- **Database:** PostgreSQL with CoLearn schema
- **Session Storage:** Prisma Session Store

## 📱 Mobile/Web Testing

You can also test these APIs from:
- **Frontend applications**
- **Mobile apps**
- **Other API clients** (Insomnia, Thunder Client, etc.)

## 🤝 Team Collaboration

Share this folder with your team for consistent API testing across all environments.

---

**Happy Testing! 🎯**

For issues or questions, check the `API-Testing-Guide.md` file for detailed instructions.
