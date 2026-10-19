import mongoose from 'mongoose';

const closedDaySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true,
  },
});

const ClosedDay = mongoose.model('ClosedDay', closedDaySchema);

export default ClosedDay;
