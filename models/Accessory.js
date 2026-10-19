import mongoose from 'mongoose';

const accessorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  brand: {
    type: String,
    trim: true,
  },
  compatibleModels: [{
    type: String,
  }],
  condition: {
    type: String,
    enum: ['original', 'copy', 'refurbished'],
    default: 'original',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  discountPrice: {
    type: Number,
    min: 0,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  images: [{
    type: String,
  }],
  warrantyDays: {
    type: Number,
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Accessory = mongoose.model('Accessory', accessorySchema);

export default Accessory;
