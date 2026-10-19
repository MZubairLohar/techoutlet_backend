import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import accessoryRoutes from './routes/accessoryRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import closedDayRoutes from './routes/closedDayRoutes.js';
import brandDetailRoutes from './routes/brandDetailRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
const allowedOrigins = new Set([
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:5005',
  'https://techoutlet.uk',
  'https://www.techoutlet.uk',
  ...(process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
]);
for (const origin of allowedOrigins) {
  try {
    allowedOrigins.add(new URL(origin).origin);
  } catch {
    // Keep non-URL configured values unchanged so they fail closed.
  }
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    const error = new Error('Origin not allowed by CORS');
    error.status = 403;
    return callback(error);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.body = req.body || {};
  next();
});

// Health check route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TechOutlet API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', brandRoutes);
app.use('/api/v1', serviceRoutes);
app.use('/api/v1', accessoryRoutes);
app.use('/api/v1', blogRoutes);
app.use('/api/v1', contactRoutes);
app.use('/api/v1', closedDayRoutes);
app.use('/api/v1', brandDetailRoutes);
app.use('/api/v1', dashboardRoutes);
app.use('/api/v1', appointmentRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║        🚀 TechOutlet Backend API Server 🚀           ║
  ║                                                       ║
  ║   Server running on port: ${PORT}                      ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
  ║   API Base URL: http://localhost:${PORT}/api/v1        ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `);
});

export default app;
