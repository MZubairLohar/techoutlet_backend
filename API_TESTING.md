# 🧪 API Testing Guide

Complete test examples for all TechOutlet API endpoints.

## Base URL
```
http://localhost:5005/api/v1
```

---

## 1️⃣ Authentication

### Register Admin (First Time Setup)
```bash
curl -X POST http://localhost:5005/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin User",
    "email": "admin@techoutlet.uk",
    "password": "SecurePass123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:5005/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@techoutlet.uk",
    "password": "SecurePass123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "email": "admin@techoutlet.uk",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 2️⃣ Brands & Models

### Create Brand
```bash
curl -X POST http://localhost:5005/api/v1/create \
  -H "Content-Type: application/json" \
  -d '{"brand": "apple"}'
```

The frontend sends `multipart/form-data` to this endpoint with a JSON `models` field and one repeated `images` field per model. JSON requests without models remain supported.

### Get All Brands
```bash
curl http://localhost:5005/api/v1/brands
```

### Get Models by Brand
```bash
curl http://localhost:5005/api/v1/models/apple
```

### Add Model to Brand
```bash
curl -X POST http://localhost:5005/api/v1/add-model/apple \
  -F "modelName=iphone15pro" \
  -F "image=@/path/to/iphone15.jpg"
```

### Delete Model
```bash
curl -X DELETE http://localhost:5005/api/v1/delete/apple/iphone15pro
```

### Delete Brand
```bash
curl -X DELETE http://localhost:5005/api/v1/delete/apple
```

### Toggle Model Availability
```bash
curl -X PATCH http://localhost:5005/api/v1/models/apple/iphone15pro \
  -H "Content-Type: application/json" \
  -d '{"isAvailable": false}'
```

---

## 3️⃣ Services

### Get All Services
```bash
curl http://localhost:5005/api/v1/getAllServices
```

### Create Service
```bash
curl -X POST http://localhost:5005/api/v1/services \
  -H "Content-Type: application/json" \
  -d '{
    "ServiceName": "Screen Replacement",
    "Description": "Professional screen repair service",
    "icon": "📱"
  }'
```

### Update Service
```bash
curl -X PUT http://localhost:5005/api/v1/services/SERVICE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "ServiceName": "Premium Screen Replacement",
    "Description": "Premium quality screen repair"
  }'
```

The frontend also calls `POST /createService` and `PUT /updateService/:id`. These aliases accept `ServiceName` and `price` without requiring `Description`.

### Delete Service
```bash
curl -X DELETE http://localhost:5005/api/v1/deleteService/SERVICE_ID
```

---

## 4️⃣ Accessories

### Get All Accessories
```bash
curl http://localhost:5005/api/v1/getAccessories
```

### Create Accessory
```bash
curl -X POST http://localhost:5005/api/v1/accessories \
  -F "name=Phone Case" \
  -F "category=protector" \
  -F "brand=apple" \
  -F "compatibleModels=[\"iphone15\"]" \
  -F "condition=original" \
  -F "price=25" \
  -F "discountPrice=20" \
  -F "stock=50" \
  -F "description=Protective phone case" \
  -F "warrantyDays=90" \
  -F "image=@/path/to/case1.jpg"
```

The legacy repeated `images` field remains supported for existing clients.

### Update Accessory
```bash
curl -X PUT http://localhost:5005/api/v1/accessories/ACCESSORY_ID \
  -F "price=22" \
  -F "stock=45"
```

### Delete Accessory
```bash
curl -X DELETE http://localhost:5005/api/v1/deleteAccessory/ACCESSORY_ID
```

---

## 5️⃣ Blogs

### Get All Blogs
```bash
curl http://localhost:5005/api/v1/getBlogs
```

### Create Blog
```bash
curl -X POST http://localhost:5005/api/v1/blogs \
  -F "title=Top 10 iPhone Tips" \
  -F "content=Here are the best iPhone tips..." \
  -F "author=John Doe" \
  -F "verified=true" \
  -F "image=@/path/to/blog-image.jpg"
```

### Like/Dislike Blog
```bash
curl -X PUT http://localhost:5005/api/v1/likeDislike/BLOG_ID \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "type": "like"
  }'
```

### React to Blog
```bash
curl -X POST http://localhost:5005/api/v1/react/BLOG_ID \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "type": "like"
  }'
```

### Delete Blog
```bash
curl -X DELETE http://localhost:5005/api/v1/deleteBlog/BLOG_ID
```

---

## Repair Appointments

### Submit a Repair Booking
```bash
curl -X POST http://localhost:5005/api/v1/sendRepairingRequest \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phoneNumber": "02012345678",
    "mobileType": "apple iphone15",
    "problem": "Screen Repair",
    "comment": "Screen is cracked",
    "AppointmentTime": "2026-12-25T10:00:00.000Z"
  }'
```

### List Repair Bookings
```bash
curl http://localhost:5005/api/v1/getRepairingRequest
```

---

## 6️⃣ Contact Messages

### Get All Contacts
```bash
curl http://localhost:5005/api/v1/getContacts
```

### Submit Contact Form
```bash
curl -X POST http://localhost:5005/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": 1234567890,
    "message": "I need help with my phone repair"
  }'
```

### Reply to Contact
```bash
curl -X POST http://localhost:5005/api/v1/replyToContact \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "subject": "Re: Your Inquiry",
    "message": "Thank you for contacting us. We will help you..."
  }'
```

### Delete Contact
```bash
curl -X DELETE http://localhost:5005/api/v1/deleteContact/CONTACT_ID
```

---

## 7️⃣ Closed Days

### Get All Closed Days
```bash
curl http://localhost:5005/api/v1/getClosedDays
```

### Add Closed Day
```bash
curl -X POST http://localhost:5005/api/v1/closeDay \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-12-25",
    "reason": "Christmas Holiday"
  }'
```

### Delete Closed Day
```bash
curl -X DELETE http://localhost:5005/api/v1/closeDay/CLOSED_DAY_ID
```

---

## 8️⃣ Brand Details

### Get All Brand Details
```bash
curl http://localhost:5005/api/v1/getBrandDetails
```

### Create Brand Detail
```bash
curl -X POST http://localhost:5005/api/v1/brandDetail \
  -F "brand=Apple" \
  -F "description=Apple is a leading tech company..." \
  -F "image=@/path/to/apple-logo.jpg"
```

### Update Brand Detail
```bash
curl -X PUT http://localhost:5005/api/v1/editBrandDetail/DETAIL_ID \
  -F "brand=Apple Inc." \
  -F "description=Updated description..."
```

### Delete Brand Detail
```bash
curl -X DELETE http://localhost:5005/api/v1/deleteBrandDetail/DETAIL_ID
```

---

## 9️⃣ Dashboard

### Get Dashboard Data
```bash
curl http://localhost:5005/api/v1/getDashboardData
```

**Response:**
```json
{
  "success": true,
  "data": {
    "counts": {
      "accessories": 15,
      "services": 8,
      "brands": 5,
      "models": 23,
      "blogs": 12,
      "contacts": 7,
      "appointments": 19,
      "orders": 34
    },
    "recentActivity": {
      "pendingAppointments": [...],
      "recentOrders": [...]
    }
  }
}
```

---

## 🔟 Health Check

### Check API Health
```bash
curl http://localhost:5005/api/v1/health
```

**Response:**
```json
{
  "success": true,
  "message": "TechOutlet API is running",
  "timestamp": "2026-10-19T12:27:26.988Z"
}
```

---

## 🧪 Testing with Postman

### Import Collection
1. Open Postman
2. Import > Raw Text
3. Paste the following collection:

```json
{
  "info": {
    "name": "TechOutlet API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"admin@techoutlet.uk\",\"password\":\"admin123\"}"
            },
            "url": "{{baseUrl}}/login"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5005/api/v1"
    }
  ]
}
```

---

## 📝 Response Format

Successful list responses expose the array in both `data` and `message` for existing frontend compatibility. Successful responses follow this format:
```json
{
  "success": true,
  "data": {...},
  "count": 10  // For list endpoints
}
```

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🔐 Protected Routes (Future)

To protect routes, add the auth middleware in routes:

```javascript
import { protect } from '../middleware/auth.js';

router.post('/services', protect, createService);
```

Then include JWT token in requests:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5005/api/v1/services
```

---

Happy Testing! 🚀
