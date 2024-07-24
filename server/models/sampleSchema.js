const mongoose = require('mongoose');

const sampleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending',
  },
  report: {
    type: String,
  }
});

const Sample = mongoose.model('Sample', sampleSchema);

module.exports = Sample;
