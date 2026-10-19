#!/bin/bash

echo "════════════════════════════════════════════════════"
echo "  🚀 TechOutlet Backend Setup Script"
echo "════════════════════════════════════════════════════"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install express mongoose dotenv cors bcryptjs jsonwebtoken cloudinary multer multer-storage-cloudinary nodemailer express-validator

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created!"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file with your credentials before starting the server"
    echo ""
    echo "Required credentials:"
    echo "  - MongoDB URI"
    echo "  - Cloudinary account details"
    echo "  - Gmail app password"
    echo "  - JWT secret key"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo "════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  1. Edit .env file with your credentials"
echo "  2. Run: node server.js"
echo "  3. API will be available at: http://localhost:5005/api/v1"
echo ""
echo "Need help? Check README.md or QUICKSTART.md"
echo ""
