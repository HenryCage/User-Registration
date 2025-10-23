const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
    firstname: {
        type: String, required: true
    },
    lastname: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: String,
    phone: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    verificationCode: {
        type: String,
        required: true
    },
    verificationExp: {
        type: Date,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('PendingUser', pendingUserSchema)