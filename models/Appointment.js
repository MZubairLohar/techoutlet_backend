import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: Number,
    required: [true, 'Phone number is required'],
  },
  mobileType: {
    type: String,
    required: [true, 'Mobile type is required'],
  },
  problem: {
    type: String,
    required: [true, 'Problem description is required'],
  },
  comment: {
    type: String,
  },
  AppointmentTime: {
    type: Date,
    required: [true, 'Appointment time is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
