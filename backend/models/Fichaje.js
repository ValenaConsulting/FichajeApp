import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['entrada', 'salida'],
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: function() {
      return this.type === 'salida';
    }
  }
});

const fichajeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  records: [recordSchema],
  totalDailyDuration: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('Fichaje', fichajeSchema);