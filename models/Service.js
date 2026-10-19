import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  ServiceName: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
  },
  Description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
  },
  icon: {
    type: String,
    default: '🔧',
  },
}, {
  timestamps: true,
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
