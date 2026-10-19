import mongoose from 'mongoose';

const brandDetailSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
}, {
  timestamps: true,
});

const BrandDetail = mongoose.model('BrandDetail', brandDetailSchema);

export default BrandDetail;
