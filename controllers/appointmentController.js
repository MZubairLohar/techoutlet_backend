import Appointment from '../models/Appointment.js';
import { sendAppointmentEmails } from '../utils/appointmentEmail.js';

export const getRepairingRequests = async (req, res, next) => {
  try {
    const appointments = await Appointment.find().sort({ AppointmentTime: 1 });
    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
      message: appointments,
    });
  } catch (error) {
    return next(error);
  }
};

export const createRepairingRequest = async (req, res, next, emailSender = sendAppointmentEmails) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      mobileType,
      problem,
      comment,
      AppointmentTime,
    } = req.body;

    if (!name || !email || !phoneNumber || !mobileType || !problem || !AppointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone number, device, problem, and appointment time are required',
      });
    }

    const appointment = await Appointment.create({
      name,
      email,
      phoneNumber,
      mobileType,
      problem,
      comment,
      AppointmentTime,
    });

    const emailNotifications = await emailSender(appointment)
      .catch((error) => {
        console.error('Appointment email notifications could not be sent:', error.message);
        return [
          { recipient: 'info@techoutlet.uk', status: 'failed', error: error.message },
          { recipient: appointment.email, status: 'failed', error: error.message },
        ];
      });

    for (const notification of emailNotifications) {
      if (notification.status === 'failed') {
        console.error(
          `Appointment email delivery failed for ${notification.recipient}: ${notification.error}`
        );
      }
    }

    return res.status(201).json({
      success: true,
      data: appointment,
      message: appointment,
      emailNotifications: emailNotifications.map(({ recipient, status }) => ({ recipient, status })),
    });
  } catch (error) {
    return next(error);
  }
};
