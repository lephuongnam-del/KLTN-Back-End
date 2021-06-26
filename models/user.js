const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,

    },
    identityCard: {
        type: Number,
        required: true

    },
    addr: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    dateOfBirth:{
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema);