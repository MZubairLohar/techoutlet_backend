# 🚀 Quick Start Guide

## Setup in 3 Steps

### 1️⃣ Install Dependencies
```bash
cd techoutlet-backend
npm install express mongoose dotenv cors bcryptjs jsonwebtoken cloudinary multer multer-storage-cloudinary nodemailer express-validator
```

### 2️⃣ Configure Environment
Copy `.env.example` to `.env` and update with your credentials:

```env
PORT=5005
NODE_ENV=development
MONGODB_URI=mongodb+srv://your_user:your_pass@cluster.mongodb.net/mobilerepair_app
JWT_SECRET=your_super_secret_key_minimum_32_characters_long
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:8080
```

### 3️⃣ Start Server
```bash
node server.js
```

Your API will be running at: **http://localhost:5005/api/v1**

## 🔑 Create First Admin

```bash
curl -X POST http://localhost:5005/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin User",
    "email": "admin@techoutlet.uk",
    "password": "SecurePassword123!"
  }'
```

## ✅ Test API

```bash
# Health check
curl http://localhost:5005/api/v1/health

# Login
curl -X POST http://localhost:5005/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@techoutlet.uk",
    "password": "SecurePassword123!"
  }'

# Get all brands
curl http://localhost:5005/api/v1/brands
```

## 📱 Update Frontend

In your frontend `src/Base_URL/Base_URL.ts`, uncomment the local URL:

```typescript
export const BASE_URL = "http://localhost:5005/api/v1";
// export const BASE_URL = "https://mobile-fix-backened.vercel.app/api/v1";
```

## 🎯 You're Ready!

The API supports the frontend's current endpoint paths and payloads, including repair bookings and multipart uploads.
