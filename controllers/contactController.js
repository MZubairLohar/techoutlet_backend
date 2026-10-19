import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

// @desc    Get all contacts
// @route   GET /api/v1/getContacts
// @access  Public
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
      message: contacts,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Create contact message
// @route   POST /api/v1/contact
// @access  Public
export const createContact = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, message } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      message,
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Contact message sent successfully',
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Reply to contact
// @route   POST /api/v1/replyToContact
// @access  Public
export const replyToContact = async (req, res, next) => {
  try {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Email, subject, and message are required' });
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>TechOutlet Response</h2>
          <p>${message}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This email was sent from TechOutlet Mobile Repair Service
          </p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete contact
// @route   DELETE /api/v1/deleteContact/:id
// @access  Public
export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    await Contact.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};
