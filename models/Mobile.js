import mongoose from 'mongoose';

const mobileSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    lowercase: true,
  },
  models: [{
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  }],
}, {
  timestamps: true,
});

const Mobile = mongoose.model('Mobile', mobileSchema);

export default Mobile;
