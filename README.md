# 🎓 CoLearn - Skill Swap Platform

> **Problem Statement 1: Skill Swap Platform**  

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/henilptel/CoLearn)
[![React](https://img.shields.io/badge/Frontend-React%2019.1-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20Express-green)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Prisma-orange)](https://prisma.io/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%20%2B%20JavaScript-blue)](https://www.typescriptlang.org/)

## 👥 Team Members

| Name | Email |
|------|-------|
| **Henil Patel** | henilptel@gmail.com 
| **Ayush Khubchandani** | ayushkhubchandani2004@gmail.com 
| **Varad Chaudhari** | varadchaudhari04@gmail.com 
| **Vacha Buch** | vachakb@gmail.com 


## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#-architecture)
- [📁 Project Structure](#-project-structure)
- [🔧 Setup & Installation](#-setup--installation)
- [📚 API Documentation](#-api-documentation)
- [✅ Completed Features](#-completed-features)
- [🚧 In Progress](#-in-progress)
- [📸 Screenshots](#-screenshots)

## 🎯 Project Overview

CoLearn is a comprehensive skill exchange platform that connects individuals looking to learn new skills and also teach their known skills. Built with modern web technologies, it features a robust matching system, real-time availability management, and secure user authentication.

### 🎪 Key Highlights

- **Multi-step Registration**: Intuitive user onboarding with progressive skill profiling
- **Smart Matching**: Algorithm-based skill matching between users
- **Real-time Availability**: Dynamic scheduling system with time slot management
- **Secure Authentication**: JWT-based auth with Google OAuth integration
- **Admin Dashboard**: Comprehensive platform management tools
- **Rating System**: Post-swap feedback and rating mechanism
- **Responsive Design**: Mobile-first approach with modern UI

## ✨ Features

### 👤 User Features

#### 🏁 Registration & Profile Management
- [x] **Multi-step Registration Process**
  - Step 1: Basic Information (Name, Email, Password)
  - Step 2: Professional Details (Experience, Location)
  - Step 3: Bio & Skills (Skills Offered/Wanted)
  - Step 4: Availability (Time Slots)
- [x] **Profile Customization**
  - Upload profile photos
  - Set public/private visibility
  - Edit bio and professional details
- [x] **Google OAuth Integration**
  - One-click registration/login
  - Seamless social authentication

#### 🔍 Discovery & Search
- [x] **Advanced User Search**
  - Search by skills, name, or location
  - Filter by availability and ratings
  - Smart recommendations
- [x] **Browse Public Profiles**
  - View detailed skill profiles
  - Check availability and ratings
  - Previous swap history

#### 🤝 Skill Swapping
- [x] **Create Swap Requests**
  - Request specific skills from other users
  - Offer skills in exchange
  - Add personalized messages
- [x] **Swap Management**
  - Accept/reject incoming requests
  - Track pending, accepted, and completed swaps
  - Cancel requests if needed
- [x] **Smart Validation**
  - Prevents requests without offered skills
  - Validates skill compatibility

#### ⭐ Ratings & Feedback
- [x] **Post-Swap Ratings**
  - Rate learning experience (1-5 stars)
  - Provide detailed feedback
  - Build reputation system

### 🛡️ Admin Features

#### 📊 Dashboard & Analytics
- [x] **Comprehensive Overview**
  - Total users statistics
  - Active swaps monitoring
  - Pending skill approvals
  - User activity metrics
- [x] **User Management**
  - View all registered users
  - Ban/unban users
  - Manage user reports

#### 🔧 Content Moderation
- [x] **Skill Verification**
  - Approve/reject skill descriptions
  - Prevent spam and inappropriate content
  - Maintain quality standards
- [x] **Platform Monitoring**
  - Track swap completion rates
  - Monitor user feedback
  - Generate activity reports

## 🏗️ Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React Frontend│────│  Express.js API │────│  PostgreSQL DB  │
│   (TypeScript)  │    │   (Node.js)     │    │   (Prisma ORM)  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │                 │              │
         └──────────────│  Authentication │──────────────┘
                        │   (JWT + OAuth) │
                        │                 │
                        └─────────────────┘
```

### Database Schema
```
User ──────────────┐
│   ┌─────────────┐│
│   │ Skills      ││
│   │ (Many-to-   ││
│   │  Many)      ││
│   └─────────────┘│
│                  │
├── TimeSlots ─────┤
├── SwapRequests ──┤
└── Ratings ───────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 19.1** - Modern component-based UI
- **TypeScript** - Type-safe development
- **React Router DOM** - Client-side routing
- **Formik + Yup** - Form handling and validation
- **Bootstrap 5** - Responsive design framework
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js + Express.js** - Server-side JavaScript runtime
- **Prisma ORM** - Database toolkit and query builder
- **PostgreSQL** - Relational database
- **JWT** - Secure authentication tokens
- **Passport.js** - Authentication middleware
- **Google OAuth 2.0** - Social login integration
- **bcryptjs** - Password hashing
- **Express Session** - Session management

## 📁 Project Structure

```
CoLearn/
├── 📂 backend/
│   ├── 📂 controllers/          # Request handlers
│   │   ├── authController.js    # Authentication logic
│   │   ├── userController.js    # User management
│   │   ├── swapController.js    # Swap request handling
│   │   └── ...
│   ├── 📂 middleware/           # Custom middleware
│   ├── 📂 models/              # Database models
│   ├── 📂 routes/              # API routes
│   ├── 📂 prisma/              # Database schema & migrations
│   ├── app.js                  # Express app setup
│   └── package.json
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/       # Reusable components
│   │   ├── 📂 pages/           # Page components
│   │   ├── 📂 contexts/        # React contexts
│   │   ├── 📂 hooks/           # Custom hooks
│   │   ├── 📂 apis/            # API client functions
│   │   ├── 📂 types/           # TypeScript type definitions
│   │   └── main.tsx            # App entry point
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager

### 1. Clone Repository
```bash
git clone https://github.com/henilptel/CoLearn.git
cd CoLearn
```

### 2. Backend Setup
```bash
cd backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secrets

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed the database (optional)
npx prisma db seed

# Start the server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev
```

### 4. Environment Variables

**Backend (.env):**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/colearn"
JWT_SECRET="your-super-secret-jwt-key"
SESSION_SECRET="your-session-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register           # User registration
POST /api/auth/login              # User login
POST /api/auth/google             # Google OAuth
POST /api/auth/logout             # User logout
```

### User Management
```
GET  /api/users/profile           # Get current user profile
PUT  /api/users/profile           # Update user profile
GET  /api/users/search            # Search users
GET  /api/users/:id               # Get user by ID
GET  /api/users/tags              # Get all skill tags
```

### Swap Requests
```
POST /api/swap                    # Create swap request
GET  /api/swap/sent               # Get sent requests
GET  /api/swap/received           # Get received requests
PATCH /api/swap/:id/status        # Update request status
DELETE /api/swap/:id              # Delete request
```

### Session Management
```
POST /api/session/time-slots      # Create time slots
GET  /api/session/:userId/time-slots  # Get user time slots
PUT  /api/session/:userId/time-slots  # Update time slots
```


## ✅ Completed Features

### 🎯 Core Functionality (100% Complete)
- [x] **User Registration & Authentication**
  - Multi-step registration process
  - JWT-based authentication
  - Google OAuth integration
  - Password hashing and security

- [x] **Profile Management**
  - Complete profile creation and editing
  - Skills management (offered/wanted)
  - Availability scheduling
  - Photo uploads and privacy settings

- [x] **Skill Discovery**
  - Advanced search functionality
  - User browsing and filtering
  - Skill-based recommendations
  - Location-based search

- [x] **Swap Request System**
  - Create and manage swap requests
  - Accept/reject functionality
  - Status tracking and notifications
  - Smart validation rules

### 🔧 Technical Implementation (100% Complete)
- [x] **Database Architecture**
  - Prisma ORM integration
  - Relational database design
  - Data validation and constraints
  - Migration system

- [x] **API Development**
  - RESTful API design
  - Input validation
  - Error handling
  - Authentication middleware

- [x] **Frontend Architecture**
  - React component structure
  - State management
  - Routing system
  - Form handling

### 🛡️ Security & Performance (100% Complete)
- [x] **Authentication Security**
  - JWT token implementation
  - Password hashing
  - Session management
  - CORS configuration

- [x] **Data Validation**
  - Input sanitization
  - Type checking
  - Schema validation
  - Error handling

## 🚧 In Progress

### 🔄 Active Development
- [ ] **Rating System Integration** (Backend: 80%, Frontend: 60%)
  - Rating CRUD operations ✅
  - Rating display in profiles 🚧
  - Rating-based user sorting 🚧

- [ ] **Admin Dashboard Enhancement** (70% Complete)
  - User management interface ✅
  - Statistics dashboard ✅
  - Real-time data integration 🚧
  - Export functionality 🚧

- [ ] **Google Calendar Integration** (40% Complete)
  - Google Calendar API setup 🚧
  - Event scheduling 🚧
  - Availability synchronization 🚧

## 📸 Screenshots

### Registration Process
![Registration Flow](https://via.placeholder.com/800x400/4CAF50/FFFFFF?text=Multi-Step+Registration)

### User Dashboard
![User Dashboard](https://via.placeholder.com/800x400/2196F3/FFFFFF?text=User+Dashboard)

### Skill Discovery
![Skill Discovery](https://via.placeholder.com/800x400/FF9800/FFFFFF?text=Skill+Discovery)

### Admin Panel
![Admin Panel](https://via.placeholder.com/800x400/9C27B0/FFFFFF?text=Admin+Dashboard)

## 🙏 Acknowledgments

- Thanks to Odoo for hosting the hackathon

---

<div align="center">
  <h3>🎯 Built with ❤️ for Odoo Hackathon 2025</h3>
  <p>Made by Team CoLearn</p>
</div>
