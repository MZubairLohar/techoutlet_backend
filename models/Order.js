import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
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
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String,
  },
  items: [{
    accessoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Accessory',
    },
    name: String,
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  notes: String,
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
