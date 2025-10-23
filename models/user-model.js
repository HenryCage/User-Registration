const mongoose = require('mongoose');

const User = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: String,
  address: String,
  phone: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  verificationCode: String,
  verificationExp: Date,
  isVerified: {
    type: Boolean,
    default: false
  }
}, {timestamps: true})

module.exports = mongoose.model('User', User)