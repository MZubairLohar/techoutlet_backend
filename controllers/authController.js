import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Login admin
// @route   POST /api/v1/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    const { password } = req.body;
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        token: generateToken(admin._id),
      },
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Register admin (for initial setup)
// @route   POST /api/v1/register
// @access  Public (should be protected in production)
export const registerAdmin = async (req, res, next) => {
  try {
    const { fullName, password } = req.body;
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(409).json({ success: false, message: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        token: generateToken(admin._id),
      },
    });
  } catch (error) {
    return next(error);
  }
};
