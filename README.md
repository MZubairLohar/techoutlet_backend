# TechOutlet Backend API

A complete Node.js/Express backend for TechOutlet Mobile Repair & Electronics Shop.

## 📋 Features

- **Authentication**: JWT-based admin authentication
- **Brand Management**: Create/read/update/delete mobile brands and models
- **Service Management**: Manage repair services
- **Accessory Management**: Full CRUD for accessories with image upload
- **Blog System**: Create blogs with like/dislike functionality
- **Contact Management**: Handle customer inquiries with email responses
- **Appointments**: Manage repair appointments
- **Dashboard**: Analytics and statistics
- **Cloud Storage**: Cloudinary integration for image uploads

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer
- **Security**: bcryptjs for password hashing
- **Validation**: express-validator

## 📁 Project Structure

```
techoutlet-backend/
├── config/
│   ├── database.js          # MongoDB connection
│   └── cloudinary.js        # Cloudinary configuration
├── controllers/
│   ├── authController.js
│   ├── brandController.js
│   ├── serviceController.js
│   ├── accessoryController.js
│   ├── blogController.js
│   ├── contactController.js
│   ├── closedDayController.js
│   ├── brandDetailController.js
│   ├── dashboardController.js
│   └── appointmentController.js
├── models/
│   ├── Admin.js
│   ├── Mobile.js
│   ├── Service.js
│   ├── Accessory.js
│   ├── Blog.js
│   ├── Contact.js
│   ├── Appointment.js
│   ├── ClosedDay.js
│   ├── BrandDetail.js
│   └── Order.js
├── routes/
│   ├── authRoutes.js
│   ├── brandRoutes.js
│   ├── serviceRoutes.js
│   ├── accessoryRoutes.js
│   ├── blogRoutes.js
│   ├── contactRoutes.js
│   ├── closedDayRoutes.js
│   ├── brandDetailRoutes.js
│   ├── dashboardRoutes.js
│   └── appointmentRoutes.js
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── errorHandler.js      # Error handling
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── server.js                # Entry point
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image uploads)
- Gmail account (for email functionality)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
```bash
cp .env.example .env
```

Edit `.env` file with your credentials:

```env
# Server Configuration
PORT=5005
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mobilerepair_app

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:8080
```

### Database Setup

The backend will automatically connect to MongoDB. Collections will be created on first use.

### Running the Server

**Development mode**:
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5005`

## 📡 API Endpoints

### Base URL
```
http://localhost:5005/api/v1
```

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Admin login |
| POST | `/register` | Register admin (initial setup) |

### Brands & Models

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create new brand |
| GET | `/brands` | Get all brands |
| GET | `/models/:brand` | Get models by brand |
| POST | `/add-model/:brand` | Add model to brand |
| DELETE | `/delete/:brand/:modelName?` | Delete brand or model |
| PATCH | `/models/:brand/:modelName` | Update model availability |
| PATCH | `/edit/:brand/:modelName` | Edit a model name and/or image |

### Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/getAllServices` | Get all services |
| POST | `/services` | Create service |
| PUT | `/services/:id` | Update service |
| POST | `/createService` | Frontend-compatible create alias |
| PUT | `/updateService/:id` | Frontend-compatible update alias |
| DELETE | `/deleteService/:id` | Delete service |

### Accessories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/getAccessories` | Get all accessories |
| POST | `/accessories` | Create accessory (with images) |
| PUT | `/accessories/:id` | Update accessory |
| DELETE | `/deleteAccessory/:id` | Delete accessory |

### Blogs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/getBlogs` | Get all blogs |
| POST | `/blogs` | Create blog (with image) |
| PUT | `/likeDislike/:id` | Like/dislike blog |
| POST | `/react/:id` | React to blog |
| DELETE | `/deleteBlog/:id` | Delete blog |

### Contacts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/getContacts` | Get all contacts |
| POST | `/contact` | Submit contact form |
| POST | `/replyToContact` | Reply to contact via email |
| DELETE | `/deleteContact/:id` | Delete contact |

### Closed Days

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/getClosedDays` | Get all closed days |
| POST | `/closeDay` | Add closed day |
| DELETE | `/closeDay/:id` | Delete closed day |

### Brand Details

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/getBrandDetails` | Get all brand details |
| POST | `/brandDetail` | Create brand detail |
| PUT | `/editBrandDetail/:id` | Update brand detail |
| DELETE | `/deleteBrandDetail/:id` | Delete brand detail |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/getDashboardData` | Get dashboard statistics |

### Repair Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/sendRepairingRequest` | Submit a repair booking |
| GET | `/getRepairingRequest` | List repair bookings |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health status |

## 🔐 Authentication

JWT login returns a token in `data.token`. The current frontend stores that token but does not send an Authorization header with its API calls. To preserve the frontend's current behavior, those routes remain accessible without a token; the `protect` middleware can be added when the frontend sends the token.

```
Authorization: Bearer <your_jwt_token>
```

## 📤 File Uploads

Endpoints that accept file uploads:
- `/create` - Repeated `images` fields matching model entries in the `models` JSON field
- `/add-model/:brand` - Single image
- `/edit/:brand/:modelName` - Optional replacement image
- `/accessories` - Frontend `image` field or legacy `images` fields (max 5)
- `/blogs` - Single image
- `/brandDetail` - Single image

Use `multipart/form-data` for file uploads.

Repair bookings send separate confirmation emails to the customer and `info@techoutlet.uk`, using `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, and `EMAIL_PASS`. Delivery failures are logged and included in the booking response; the saved appointment is not discarded if SMTP is unavailable.

## 🗄️ Database Collections

- **admins** - Admin users
- **mobiles** - Mobile brands and models
- **services** - Repair services
- **accessories** - Accessories inventory
- **blogs** - Blog posts
- **contacts** - Customer inquiries
- **appointments** - Repair appointments
- **closeddays** - Shop closed dates
- **branddetails** - Brand information pages
- **orders** - Customer orders

## 🔧 Configuration Notes

### Cloudinary Setup
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret from the dashboard
3. Add credentials to `.env`

### Gmail App Password
1. Enable 2-factor authentication on your Google account
2. Generate an app password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use the generated password in `EMAIL_PASS`

### MongoDB Atlas Setup
1. Create a cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP address
4. Get connection string and add to `MONGODB_URI`

## 🚨 Initial Admin Setup

To create the first admin account, make a POST request to `/api/v1/register`:

```json
{
  "fullName": "Admin User",
  "email": "admin@techoutlet.uk",
  "password": "your_secure_password"
}
```

**⚠️ Important**: Secure or disable the `/register` endpoint in production!

## 📝 Example Requests

### Login
```bash
curl -X POST http://localhost:5005/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techoutlet.uk","password":"password123"}'
```

### Create Brand
```bash
curl -X POST http://localhost:5005/api/v1/create \
  -H "Content-Type: application/json" \
  -d '{"brand":"apple"}'
```

### Add Model
```bash
curl -X POST http://localhost:5005/api/v1/add-model/apple \
  -F "modelName=iphone15" \
  -F "image=@/path/to/image.jpg"
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify your connection string in `.env`
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure network access is configured correctly

### Cloudinary Upload Errors
- Verify your Cloudinary credentials
- Check file size limits
- Ensure proper file formats (jpg, jpeg, png, webp, gif)

### Email Not Sending
- Verify Gmail app password is correct
- Check if 2FA is enabled on Gmail account
- Ensure EMAIL_HOST and EMAIL_PORT are correct

## 🔄 CORS Configuration

Update `FRONTEND_URL` in `.env` (comma-separated for multiple origins) to match your frontend URL:
- Development: `http://localhost:8080` (Vite) or `http://localhost:5173`
- Production: `https://yourdomain.com`

## 📦 Deployment

### Vercel/Railway/Render
1. Connect your repository
2. Set environment variables
3. Deploy

### Manual Deployment
```bash
npm install --production
NODE_ENV=production node server.js
```

## 🤝 Contributing

This backend was rebuilt from the TechOutlet frontend requirements and MongoDB schemas.

## 📄 License

ISC

## 🆘 Support

For issues or questions, check the console logs for detailed error messages.

---

**Built with ❤️ for TechOutlet**
